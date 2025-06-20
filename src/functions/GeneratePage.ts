import type { MessageActionRowComponentBuilder } from "discord.js"
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
} from "discord.js"

import { Paginate } from "@/functions/Paginate.js"
import type {
	IGeneratePage,
	PaginationItem,
	PaginationOptions,
} from "@/types.js"
import { defaultIds, PaginationType, SelectMenuPageId } from "@/types.js"

export function GeneratePage(
	item: PaginationItem,
	page: number,
	maxPage: number,
	config: PaginationOptions,
): IGeneratePage {
	const beginning = page === 0
	const end = page === maxPage - 1

	const newMessage: PaginationItem = item

	function isStartEndAllowed(): boolean {
		if (config.showStartEnd === undefined) {
			return true
		}

		if (typeof config.showStartEnd === "number") {
			return maxPage >= config.showStartEnd
		}

		return config.showStartEnd
	}

	/**
   * Pagination type button
   */
	if (config.type === PaginationType.Button) {
		const startBtn = new ButtonBuilder()
		.setCustomId(config.start?.id ?? defaultIds.buttons.start)
		.setStyle(config.start?.style ?? ButtonStyle.Primary)
		.setDisabled(beginning)

		const endBtn = new ButtonBuilder()
		.setCustomId(config.end?.id ?? defaultIds.buttons.end)
		.setStyle(config.end?.style ?? ButtonStyle.Primary)
		.setDisabled(end)

		const nextBtn = new ButtonBuilder()
		.setCustomId(config.next?.id ?? defaultIds.buttons.next)
		.setStyle(config.next?.style ?? ButtonStyle.Primary)
		.setDisabled(end)

		const prevBtn = new ButtonBuilder()
		.setCustomId(config.previous?.id ?? defaultIds.buttons.previous)
		.setStyle(config.previous?.style ?? ButtonStyle.Primary)
		.setDisabled(beginning)

		const exitBtn = new ButtonBuilder()
		.setCustomId(config.exit?.id ?? defaultIds.buttons.exit)
		.setStyle(config.exit?.style ?? ButtonStyle.Danger)

		if (config.previous?.label || !config.previous?.emoji) {
			prevBtn.setLabel(config.previous?.label ?? "Previous")
		}
		if (config.next?.label || !config.next?.emoji) {
			nextBtn.setLabel(config.next?.label ?? "Next")
		}
		if (config.start?.label || !config.start?.emoji) {
			startBtn.setLabel(config.start?.label ?? "Start")
		}
		if (config.end?.label || !config.end?.emoji) {
			endBtn.setLabel(config.end?.label ?? "End")
		}
		if (config.exit?.label || !config.exit?.emoji) {
			exitBtn.setLabel(config.exit?.label ?? "Exit")
		}
		// set emoji
		if (config.start?.emoji) {
			startBtn.setEmoji(config.start.emoji)
		}

		if (config.end?.emoji) {
			endBtn.setEmoji(config.end.emoji)
		}

		if (config.next?.emoji) {
			nextBtn.setEmoji(config.next.emoji)
		}

		if (config.previous?.emoji) {
			prevBtn.setEmoji(config.previous.emoji)
		}

		if (config.exit?.emoji) {
			exitBtn.setEmoji(config.exit.emoji)
		}

		const buttons: ButtonBuilder[] = [prevBtn, nextBtn]

		if (isStartEndAllowed()) {
			buttons.unshift(startBtn)
			buttons.push(endBtn)
		}

		if (config.enableExit) {
			buttons.push(exitBtn)
		}

		const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(buttons)
		// reset message payload additional parameters
		if (!newMessage.embeds) {
			newMessage.embeds = []
		}

		if (!newMessage.files) {
			newMessage.files = []
		}

		if (!newMessage.attachments) {
			newMessage.attachments = []
		}

		return { newMessage: newMessage, paginationRow: row }
	}

	/**
   * Pagination type select menu
   */
	const paginator = Paginate(maxPage, page, 1, 21).pages.map((i) => {
		// get custom page title
		const text = config.pageText instanceof Array
			? config.pageText[i - 1]
			: config.pageText

		return {
			label: (text ?? "Page {page}").replaceAll("{page}", i.toString()),
			value: (i - 1).toString(),
		}
	})

	if (isStartEndAllowed()) {
		// add start option
		paginator.unshift({
			label: config.labels?.start ?? "Start",
			value: SelectMenuPageId.Start.toString(),
		})

		// add end option
		paginator.push({
			label: config.labels?.end ?? "End",
			value: SelectMenuPageId.End.toString(),
		})
	}

	// add exit option
	if (config.enableExit) {
		paginator.push({
			label: config.labels?.exit ?? "Exit Pagination",
			value: SelectMenuPageId.Exit.toString(),
		})
	}

	const menu = new StringSelectMenuBuilder()
    .setCustomId(config.menuId ?? defaultIds.menu)
    .setPlaceholder(config.placeholder ?? "Select page")
    .setOptions(paginator)

	const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents([menu])

	// reset message payload additional parameters
	if (!newMessage.embeds) {
		newMessage.embeds = []
	}

	if (!newMessage.files) {
		newMessage.files = []
	}

	if (!newMessage.attachments) {
		newMessage.attachments = []
	}

	return { newMessage, paginationRow: row }
}
