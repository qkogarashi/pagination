import type {
	ButtonInteraction,
	InteractionCollector,
	StringSelectMenuInteraction,
} from "discord.js"
import {
	ChannelType,
	ChatInputCommandInteraction,
	CommandInteraction,
	ComponentType,
	ContextMenuCommandInteraction,
	Message,
	MessageComponentInteraction,
} from "discord.js"
import cloneDeep from "lodash/cloneDeep.js"

import { GeneratePage } from "@/functions/GeneratePage.js"
import type { PaginationResolver } from "@/Resolver.js"
import type {
	IGeneratePage,
	PaginationItem,
	PaginationOptions,
	PaginationSendTo,
} from "@/types.js"
import {
	defaultIds,
	defaultTime,
	PaginationType,
	SelectMenuPageId,
} from "@/types.js"

export class Pagination<T extends PaginationResolver = PaginationResolver> {
	public maxLength: number
	public currentPage: number
	public option: PaginationOptions
	public collector?: InteractionCollector<ButtonInteraction | StringSelectMenuInteraction>
	public message?: Message
	public _isSent = false
	public _isFollowUp = false

	get isSent(): boolean {
		return this._isSent
	}

	constructor(
		public sendTo: PaginationSendTo,
		public pages: PaginationItem[] | T,
		config?: PaginationOptions,
	) {
		/**
     	* Page length of pagination
     	*/
		this.maxLength = Array.isArray(pages) ? pages.length : pages.maxLength

		/**
     	* Default options
     	*/
		this.option = config ?? (this.maxLength < 20 ? { type: PaginationType.Button } : { type: PaginationType.StringSelectMenu })

		/**
		* Current page
		*/
		this.currentPage = config?.initialPage ?? 0

		/**
		* Since direct editing isn't available on ephemeral, disable exit mode
		*/
		if (this.option.ephemeral && this.option.enableExit) {
			throw Error("Ephemeral pagination does not support exit mode")
		}
	}

	/**
	* Unable to update pagination error
	*/
	private unableToUpdate(): void {
		if (this.option.debug) {
			console.log("Pagination: Unable to update pagination")
		}
	}

	/**
	* Get current page embed
	*
	* @param page
	*
	* @returns
	*/
	public getPage = async (page: number): Promise<IGeneratePage | null> => {
		const embed = Array.isArray(this.pages)
			? cloneDeep<PaginationItem | undefined>(this.pages[page])
			: await this.pages.resolver(page, this)

		if (!embed) {
			return null
		}

		return GeneratePage(embed, this.currentPage, this.maxLength, this.option)
	}

	/**
	* Start pagination and send if required
	* @returns
	*/
	public async start(): Promise<{
		collector: InteractionCollector<ButtonInteraction | StringSelectMenuInteraction>;
		message: Message;
	}> {
		if (this._isSent) {
			throw Error("Pagination: Already been sent")
		}

		const page = await this.getPage(this.currentPage)
		if (!page) {
			throw Error("Pagination: Page not found send()")
		}

		// Add a pagination row to components
		if (page.newMessage.components) {
			page.newMessage.components = [
				...page.newMessage.components,
				page.paginationRow,
			]
		} else {
			page.newMessage.components = [page.paginationRow]
		}

		let message: Message

		if (this.sendTo instanceof Message) {
			message = await this.sendTo.reply(page.newMessage)
		} else if (this.sendTo instanceof CommandInteraction || this.sendTo instanceof ContextMenuCommandInteraction) {
			if (this.sendTo.deferred || this.sendTo.replied) {
				this._isFollowUp = true
			}

			const replyMessage = await this.sendTo[this._isFollowUp ? "followUp" : "reply"](page.newMessage)
			if (!replyMessage) {
				throw Error("Failure to reply for CommandInteraction or ContextMenuCommandInteraction")
			}
			message = await replyMessage.fetch()

		} else if (this.sendTo instanceof MessageComponentInteraction) {
			if (this.sendTo.deferred || this.sendTo.replied) {
				this._isFollowUp = true
			}

			const updatedMessage = await this.sendTo[this._isFollowUp ? "followUp" : "update"](page.newMessage)
			if (!updatedMessage) {
				throw Error("Failure to update MessageComponentInteraction message")
			}
			message = await updatedMessage.fetch()
		} else {
			if (this.sendTo.type === ChannelType.GuildStageVoice) {
				throw Error("Pagination not supported with guild stage channel")
			}

			message = await this.sendTo.send(page.newMessage)
		}

		this.collector = await this.createCollector(message)
		this.message = message
		this._isSent = true

		return { collector: this.collector, message }
	}

	async createCollector(message: Message) {

		// Create collector
		const collector = message.createMessageComponentCollector({
			...this.option,
			componentType: this.option.type === PaginationType.Button ? ComponentType.Button : ComponentType.StringSelect,
			time: this.option.time ?? defaultTime,
		})

		/**
		* Reset collector timer
		*/
		const resetCollectorTimer = () => {
			collector.resetTimer({
				idle: this.option.idle,
				time: this.option.time ?? defaultTime,
			})
		}


		collector.on("collect", async (collectInteraction) => {
			if (collectInteraction.isButton() && this.option.type === PaginationType.Button) {
				if (collectInteraction.customId === (this.option.exit?.id ?? defaultIds.buttons.exit)) {
					collector.stop()
					return
				} else if (collectInteraction.customId === (this.option.start?.id ?? defaultIds.buttons.start)) {
					this.currentPage = 0
				} else if (collectInteraction.customId === (this.option.end?.id ?? defaultIds.buttons.end)) {
					this.currentPage = this.maxLength - 1
				} else if (collectInteraction.customId === (this.option.next?.id ?? defaultIds.buttons.next)) {
					if (this.currentPage < this.maxLength - 1) {
						this.currentPage++
					}
				} else if (collectInteraction.customId === (this.option.previous?.id ?? defaultIds.buttons.previous)) {
					if (this.currentPage > 0) {
						this.currentPage--
					}
				} else {
					return
				}

				await collectInteraction.deferUpdate()
				resetCollectorTimer()

				const pageEx = await this.getPage(this.currentPage)
				if (!pageEx) {
					throw Error("Pagination: Out of bound page")
				}

				if (pageEx.newMessage.components) {
					pageEx.newMessage.components = [
						...pageEx.newMessage.components,
						pageEx.paginationRow,
					]
				} else {
					pageEx.newMessage.components = [pageEx.paginationRow]
				}

				await collectInteraction.editReply(pageEx.newMessage).catch(() => {
					this.unableToUpdate()
				})
			} else if (
				collectInteraction.isStringSelectMenu() && this.option.type === PaginationType.StringSelectMenu
				&& collectInteraction.customId === (this.option.menuId ?? defaultIds.menu)
			) {
				await collectInteraction.deferUpdate()
				resetCollectorTimer()

				this.currentPage = Number(collectInteraction.values[0] ?? 0)

				if (this.currentPage === Number(SelectMenuPageId.Exit)) {
					collector.stop()
					return
				}

				if (this.currentPage === Number(SelectMenuPageId.Start)) {
					this.currentPage = 0
				}

				if (this.currentPage === Number(SelectMenuPageId.End)) {
					this.currentPage = this.maxLength - 1
				}

				const pageEx = await this.getPage(this.currentPage)
				if (!pageEx) {
					throw Error("Pagination: Out of bound page")
				}

				if (pageEx.newMessage.components) {
					pageEx.newMessage.components = [
						...pageEx.newMessage.components,
						pageEx.paginationRow,
					]
				} else {
					pageEx.newMessage.components = [pageEx.paginationRow]
				}

				await collectInteraction.editReply(pageEx.newMessage).catch(() => {
					this.unableToUpdate()
				})
			}
		})


		collector.on("end", async () => {
			const finalPage = await this.getPage(this.currentPage)
			if (message.editable && finalPage && collector.endReason !== "user") {

				// Eliminate the ephemeral pagination error, since direct editing cannot be performed
				if (this.option.ephemeral && this.sendTo instanceof ChatInputCommandInteraction) {
					if (!this._isFollowUp) {
						await this.sendTo.editReply({ components: [] }).catch(() => {
							this.unableToUpdate()
						})
					}
				} else {
					await message.edit({ components: [] }).catch(() => {
						this.unableToUpdate()
					})
				}
			}

			if (this.option.onTimeout) {
				this.option.onTimeout(this.currentPage, message)
			}
		})

		return collector
	}
}
