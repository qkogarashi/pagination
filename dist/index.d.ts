import * as discord_js from 'discord.js';
import { BaseMessageOptions, JSONEncodable, AttachmentPayload, MessageCollectorOptionsParams, MessageComponentType, Message, ComponentEmojiResolvable, ButtonStyle, ActionRowBuilder, MessageActionRowComponentBuilder, APIActionRowComponent, APIButtonComponent, APIChannelSelectComponent, APIMentionableSelectComponent, APIRoleSelectComponent, APIStringSelectComponent, APIUserSelectComponent, CommandInteraction, MessageComponentInteraction, ContextMenuCommandInteraction, TextBasedChannel, PartialGroupDMChannel, InteractionCollector, ButtonInteraction, StringSelectMenuInteraction } from 'discord.js';

declare const defaultTime = 300000;
declare const defaultIds: {
    buttons: {
        end: string;
        exit: string;
        next: string;
        previous: string;
        start: string;
    };
    menu: string;
};
type PaginationItem = BaseMessageOptions & {
    attachments?: JSONEncodable<AttachmentPayload>[];
};
type PaginationInteractions = CommandInteraction | MessageComponentInteraction | ContextMenuCommandInteraction;
type PaginationSendTo = PaginationInteractions | Message | Exclude<TextBasedChannel, PartialGroupDMChannel>;
declare enum SelectMenuPageId {
    Start = -1,
    End = -2,
    Exit = -3
}
declare enum PaginationType {
    Button = 0,
    StringSelectMenu = 1
}
interface BasicPaginationOptions extends MessageCollectorOptionsParams<MessageComponentType> {
    /**
   * Debug log
   */
    debug?: boolean;
    /**
   * Enable exit button, It will close the pagination before timeout
   */
    enableExit?: boolean;
    /**
   * Set ephemeral response
   */
    ephemeral?: boolean;
    /**
   * Initial page (default: 0)
   */
    initialPage?: number;
    /**
   * Pagination timeout callback
   */
    onTimeout?: (page: number, message: Message) => void;
    /**
   * Show start/end button/option (default: true)
   * Use number to limit based on minimum pages
   */
    showStartEnd?: boolean | number;
    /**
   * Use new V2 Components system (default: false)
   */
    isV2Components?: boolean;
}
interface ButtonOptions {
    /**
   * Button emoji
   */
    emoji?: ComponentEmojiResolvable;
    /**
   * Button id
   */
    id?: string;
    /**
   * Button label
   */
    label?: string;
    /**
   * Button style
   */
    style?: ButtonStyle;
}
interface ButtonPaginationOptions extends BasicPaginationOptions {
    /**
   * End button options
   */
    end?: ButtonOptions;
    /**
   * Exit button options
   */
    exit?: ButtonOptions;
    /**
   * Exit button options
   */
    next?: ButtonOptions;
    /**
   * Previous button options
   */
    previous?: ButtonOptions;
    /**
   * Start button options
   */
    start?: ButtonOptions;
    /**
   * select pagination type (default: BUTTON)
   */
    type: PaginationType.Button;
}
interface SelectMenuPaginationOptions extends BasicPaginationOptions {
    /**
   * Various labels
   */
    labels?: {
        end?: string;
        exit?: string;
        start?: string;
    };
    /**
   * custom select menu id (default: 'discordx@pagination@menu')
   */
    menuId?: string;
    /**
   * Define page text, use `{page}` to print page number
   * Different page texts can also be defined for different items using arrays
   */
    pageText?: string | string[];
    /**
   * Set placeholder text
   */
    placeholder?: string;
    /**
   * select pagination type (default: BUTTON)
   */
    type: PaginationType.StringSelectMenu;
}
type PaginationOptions = ButtonPaginationOptions | SelectMenuPaginationOptions;
interface IPaginate {
    currentPage: number;
    endIndex: number;
    endPage: number;
    pageSize: number;
    pages: number[];
    startIndex: number;
    startPage: number;
    totalItems: number;
    totalPages: number;
}
interface IGeneratePage {
    newMessage: BaseMessageOptions;
    paginationRow: ActionRowBuilder<MessageActionRowComponentBuilder> | APIActionRowComponent<APIButtonComponent | APIChannelSelectComponent | APIMentionableSelectComponent | APIRoleSelectComponent | APIStringSelectComponent | APIUserSelectComponent>;
}

declare function GeneratePage(item: PaginationItem, page: number, maxPage: number, config: PaginationOptions): IGeneratePage;

declare function Paginate(totalItems: number, currentPage?: number, pageSize?: number, maxPages?: number): IPaginate;

type Resolver = (page: number, pagination: Pagination) => PaginationItem | Promise<PaginationItem>;
declare class PaginationResolver<T extends Resolver = Resolver> {
    resolver: T;
    maxLength: number;
    constructor(resolver: T, maxLength: number);
}

declare class Pagination<T extends PaginationResolver = PaginationResolver> {
    sendTo: PaginationSendTo;
    pages: PaginationItem[] | T;
    maxLength: number;
    currentPage: number;
    option: PaginationOptions;
    collector?: InteractionCollector<ButtonInteraction | StringSelectMenuInteraction>;
    message?: Message;
    _isSent: boolean;
    _isFollowUp: boolean;
    get isSent(): boolean;
    constructor(sendTo: PaginationSendTo, pages: PaginationItem[] | T, config?: PaginationOptions);
    /**
    * Unable to update pagination error
    */
    private unableToUpdate;
    /**
    * Get current page embed
    *
    * @param page
    *
    * @returns
    */
    getPage: (page: number) => Promise<IGeneratePage | null>;
    /**
    * Start pagination and send if required
    * @returns
    */
    start(): Promise<{
        collector: InteractionCollector<ButtonInteraction | StringSelectMenuInteraction>;
        message: Message;
    }>;
    createCollector(message: Message): Promise<InteractionCollector<ButtonInteraction<discord_js.CacheType> | StringSelectMenuInteraction<discord_js.CacheType>>>;
}

export { GeneratePage, type IGeneratePage, type IPaginate, Paginate, Pagination, type PaginationInteractions, type PaginationItem, type PaginationOptions, PaginationResolver, type PaginationSendTo, PaginationType, type Resolver, SelectMenuPageId, defaultIds, defaultTime };
