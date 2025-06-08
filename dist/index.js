"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  GeneratePage: () => GeneratePage,
  Paginate: () => Paginate,
  Pagination: () => Pagination,
  PaginationResolver: () => PaginationResolver,
  PaginationType: () => PaginationType,
  SelectMenuPageId: () => SelectMenuPageId,
  defaultIds: () => defaultIds,
  defaultTime: () => defaultTime
});
module.exports = __toCommonJS(index_exports);

// src/functions/GeneratePage.ts
var import_discord = require("discord.js");

// src/functions/Paginate.ts
function Paginate(totalItems, currentPage = 1, pageSize = 10, maxPages = 10) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  let startPage, endPage;
  if (totalPages <= maxPages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      startPage = 1;
      endPage = maxPages;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      startPage = totalPages - maxPages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
  const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
    (i) => startPage + i
  );
  return {
    currentPage,
    endIndex,
    endPage,
    pageSize,
    pages,
    startIndex,
    startPage,
    totalItems,
    totalPages
  };
}

// src/types.ts
var defaultTime = 3e5;
var prefixId = "pagination@";
var defaultIds = {
  buttons: {
    end: `${prefixId}endButton`,
    exit: `${prefixId}closeButton`,
    next: `${prefixId}nextButton`,
    previous: `${prefixId}previousButton`,
    start: `${prefixId}startButton`
  },
  menu: `${prefixId}menu`
};
var SelectMenuPageId = /* @__PURE__ */ ((SelectMenuPageId2) => {
  SelectMenuPageId2[SelectMenuPageId2["Start"] = -1] = "Start";
  SelectMenuPageId2[SelectMenuPageId2["End"] = -2] = "End";
  SelectMenuPageId2[SelectMenuPageId2["Exit"] = -3] = "Exit";
  return SelectMenuPageId2;
})(SelectMenuPageId || {});
var PaginationType = /* @__PURE__ */ ((PaginationType2) => {
  PaginationType2[PaginationType2["Button"] = 0] = "Button";
  PaginationType2[PaginationType2["StringSelectMenu"] = 1] = "StringSelectMenu";
  return PaginationType2;
})(PaginationType || {});

// src/functions/GeneratePage.ts
function GeneratePage(item, page, maxPage, config) {
  const beginning = page === 0;
  const end = page === maxPage - 1;
  const newMessage = item;
  function isStartEndAllowed() {
    if (config.showStartEnd === void 0) {
      return true;
    }
    if (typeof config.showStartEnd === "number") {
      return maxPage >= config.showStartEnd;
    }
    return config.showStartEnd;
  }
  if (config.type === 0 /* Button */) {
    const startBtn = new import_discord.ButtonBuilder().setCustomId(config.start?.id ?? defaultIds.buttons.start).setStyle(config.start?.style ?? import_discord.ButtonStyle.Primary).setDisabled(beginning);
    const endBtn = new import_discord.ButtonBuilder().setCustomId(config.end?.id ?? defaultIds.buttons.end).setStyle(config.end?.style ?? import_discord.ButtonStyle.Primary).setDisabled(end);
    const nextBtn = new import_discord.ButtonBuilder().setCustomId(config.next?.id ?? defaultIds.buttons.next).setStyle(config.next?.style ?? import_discord.ButtonStyle.Primary).setDisabled(end);
    const prevBtn = new import_discord.ButtonBuilder().setCustomId(config.previous?.id ?? defaultIds.buttons.previous).setStyle(config.previous?.style ?? import_discord.ButtonStyle.Primary).setDisabled(beginning);
    const exitBtn = new import_discord.ButtonBuilder().setCustomId(config.exit?.id ?? defaultIds.buttons.exit).setStyle(config.exit?.style ?? import_discord.ButtonStyle.Danger);
    if (config.previous?.label || !config.previous?.emoji) {
      prevBtn.setLabel(config.previous?.label ?? "Previous");
    }
    if (config.next?.label || !config.next?.emoji) {
      nextBtn.setLabel(config.next?.label ?? "Next");
    }
    if (config.start?.label || !config.start?.emoji) {
      startBtn.setLabel(config.start?.label ?? "Start");
    }
    if (config.end?.label || !config.end?.emoji) {
      endBtn.setLabel(config.end?.label ?? "End");
    }
    if (config.exit?.label || !config.exit?.emoji) {
      exitBtn.setLabel(config.exit?.label ?? "Exit");
    }
    if (config.start?.emoji) {
      startBtn.setEmoji(config.start.emoji);
    }
    if (config.end?.emoji) {
      endBtn.setEmoji(config.end.emoji);
    }
    if (config.next?.emoji) {
      nextBtn.setEmoji(config.next.emoji);
    }
    if (config.previous?.emoji) {
      prevBtn.setEmoji(config.previous.emoji);
    }
    if (config.exit?.emoji) {
      exitBtn.setEmoji(config.exit.emoji);
    }
    const buttons = [prevBtn, nextBtn];
    if (isStartEndAllowed()) {
      buttons.unshift(startBtn);
      buttons.push(endBtn);
    }
    if (config.enableExit) {
      buttons.push(exitBtn);
    }
    const row2 = new import_discord.ActionRowBuilder().addComponents(buttons);
    if (!newMessage.embeds) {
      newMessage.embeds = [];
    }
    if (!newMessage.files) {
      newMessage.files = [];
    }
    if (!newMessage.attachments) {
      newMessage.attachments = [];
    }
    return { newMessage, paginationRow: row2 };
  }
  const paginator = Paginate(maxPage, page, 1, 21).pages.map((i) => {
    const text = config.pageText instanceof Array ? config.pageText[i - 1] : config.pageText;
    return {
      label: (text ?? "Page {page}").replaceAll("{page}", i.toString()),
      value: (i - 1).toString()
    };
  });
  if (isStartEndAllowed()) {
    paginator.unshift({
      label: config.labels?.start ?? "Start",
      value: (-1) /* Start */.toString()
    });
    paginator.push({
      label: config.labels?.end ?? "End",
      value: (-2) /* End */.toString()
    });
  }
  if (config.enableExit) {
    paginator.push({
      label: config.labels?.exit ?? "Exit Pagination",
      value: (-3) /* Exit */.toString()
    });
  }
  const menu = new import_discord.StringSelectMenuBuilder().setCustomId(config.menuId ?? defaultIds.menu).setPlaceholder(config.placeholder ?? "Select page").setOptions(paginator);
  const row = new import_discord.ActionRowBuilder().addComponents([menu]);
  if (!newMessage.embeds) {
    newMessage.embeds = [];
  }
  if (!newMessage.files) {
    newMessage.files = [];
  }
  if (!newMessage.attachments) {
    newMessage.attachments = [];
  }
  return { newMessage, paginationRow: row };
}

// src/Pagination.ts
var import_discord2 = require("discord.js");
var import_cloneDeep = __toESM(require("lodash/cloneDeep.js"));
var Pagination = class {
  constructor(sendTo, pages, config) {
    this.sendTo = sendTo;
    this.pages = pages;
    this.maxLength = Array.isArray(pages) ? pages.length : pages.maxLength;
    this.option = config ?? (this.maxLength < 20 ? { type: 0 /* Button */ } : { type: 1 /* StringSelectMenu */ });
    this.currentPage = config?.initialPage ?? 0;
    if (this.option.ephemeral && this.option.enableExit) {
      throw Error("Ephemeral pagination does not support exit mode");
    }
  }
  maxLength;
  currentPage;
  option;
  collector;
  message;
  _isSent = false;
  _isFollowUp = false;
  get isSent() {
    return this._isSent;
  }
  /**
  * Unable to update pagination error
  */
  unableToUpdate() {
    if (this.option.debug) {
      console.log("Pagination: Unable to update pagination");
    }
  }
  /**
  * Get current page embed
  *
  * @param page
  *
  * @returns
  */
  getPage = async (page) => {
    const embed = Array.isArray(this.pages) ? (0, import_cloneDeep.default)(this.pages[page]) : await this.pages.resolver(page, this);
    if (!embed) {
      return null;
    }
    return GeneratePage(embed, this.currentPage, this.maxLength, this.option);
  };
  /**
  * Start pagination and send if required
  * @returns
  */
  async start() {
    if (this._isSent) {
      throw Error("Pagination: Already been sent");
    }
    const page = await this.getPage(this.currentPage);
    if (!page) {
      throw Error("Pagination: Page not found send()");
    }
    if (page.newMessage.components) {
      if (this.option.isV2Components) {
        const lastContainer = page.newMessage.components[page.newMessage.components.length - 1];
        if (lastContainer instanceof import_discord2.ContainerBuilder) {
          lastContainer.addActionRowComponents(page.paginationRow);
        } else {
          page.newMessage.components = [
            ...page.newMessage.components,
            new import_discord2.ContainerBuilder().addActionRowComponents(page.paginationRow)
          ];
        }
      } else {
        page.newMessage.components = [
          ...page.newMessage.components,
          page.paginationRow
        ];
      }
    } else {
      page.newMessage.components = this.option.isV2Components ? [new import_discord2.ContainerBuilder().addActionRowComponents(page.paginationRow)] : [page.paginationRow];
    }
    let message;
    if (this.sendTo instanceof import_discord2.Message) {
      message = await this.sendTo.reply({ ...page.newMessage, flags: this.option.isV2Components ? "IsComponentsV2" : [] });
    } else if (this.sendTo instanceof import_discord2.CommandInteraction || this.sendTo instanceof import_discord2.ContextMenuCommandInteraction) {
      if (this.sendTo.deferred || this.sendTo.replied) {
        this._isFollowUp = true;
      }
      const replyMessage = await this.sendTo[this._isFollowUp ? "followUp" : "reply"]({ ...page.newMessage, flags: this.option.isV2Components ? "IsComponentsV2" : [] });
      if (!replyMessage) {
        throw Error("Failure to reply for CommandInteraction or ContextMenuCommandInteraction");
      }
      message = await replyMessage.fetch();
    } else if (this.sendTo instanceof import_discord2.MessageComponentInteraction) {
      if (this.sendTo.deferred || this.sendTo.replied) {
        this._isFollowUp = true;
      }
      const updatedMessage = await this.sendTo[this._isFollowUp ? "followUp" : "update"]({ ...page.newMessage, flags: this.option.isV2Components ? "IsComponentsV2" : [] });
      if (!updatedMessage) {
        throw Error("Failure to update MessageComponentInteraction message");
      }
      message = await updatedMessage.fetch();
    } else {
      if (this.sendTo.type === import_discord2.ChannelType.GuildStageVoice) {
        throw Error("Pagination not supported with guild stage channel");
      }
      message = await this.sendTo.send({ ...page.newMessage, flags: this.option.isV2Components ? "IsComponentsV2" : [] });
    }
    this.collector = await this.createCollector(message);
    this.message = message;
    this._isSent = true;
    return { collector: this.collector, message };
  }
  async createCollector(message) {
    const collector = message.createMessageComponentCollector({
      ...this.option,
      componentType: this.option.type === 0 /* Button */ ? import_discord2.ComponentType.Button : import_discord2.ComponentType.StringSelect,
      time: this.option.time ?? defaultTime
    });
    const resetCollectorTimer = () => {
      collector.resetTimer({
        idle: this.option.idle,
        time: this.option.time ?? defaultTime
      });
    };
    collector.on("collect", async (collectInteraction) => {
      if (collectInteraction.isButton() && this.option.type === 0 /* Button */) {
        if (collectInteraction.customId === (this.option.exit?.id ?? defaultIds.buttons.exit)) {
          collector.stop();
          return;
        } else if (collectInteraction.customId === (this.option.start?.id ?? defaultIds.buttons.start)) {
          this.currentPage = 0;
        } else if (collectInteraction.customId === (this.option.end?.id ?? defaultIds.buttons.end)) {
          this.currentPage = this.maxLength - 1;
        } else if (collectInteraction.customId === (this.option.next?.id ?? defaultIds.buttons.next)) {
          if (this.currentPage < this.maxLength - 1) {
            this.currentPage++;
          }
        } else if (collectInteraction.customId === (this.option.previous?.id ?? defaultIds.buttons.previous)) {
          if (this.currentPage > 0) {
            this.currentPage--;
          }
        } else {
          return;
        }
        await collectInteraction.deferUpdate();
        resetCollectorTimer();
        const pageEx = await this.getPage(this.currentPage);
        if (!pageEx) {
          throw Error("Pagination: Out of bound page");
        }
        if (pageEx.newMessage.components) {
          if (this.option.isV2Components) {
            const lastContainer = pageEx.newMessage.components[pageEx.newMessage.components.length - 1];
            if (lastContainer instanceof import_discord2.ContainerBuilder) {
              lastContainer.addActionRowComponents(pageEx.paginationRow);
            } else {
              pageEx.newMessage.components = [
                ...pageEx.newMessage.components,
                new import_discord2.ContainerBuilder().addActionRowComponents(pageEx.paginationRow)
              ];
            }
          } else {
            pageEx.newMessage.components = [
              ...pageEx.newMessage.components,
              pageEx.paginationRow
            ];
          }
        } else {
          pageEx.newMessage.components = this.option.isV2Components ? [new import_discord2.ContainerBuilder().addActionRowComponents(pageEx.paginationRow)] : [pageEx.paginationRow];
        }
        await collectInteraction.editReply({ ...pageEx.newMessage, flags: this.option.isV2Components ? "IsComponentsV2" : [] }).catch(() => {
          this.unableToUpdate();
        });
      } else if (collectInteraction.isStringSelectMenu() && this.option.type === 1 /* StringSelectMenu */ && collectInteraction.customId === (this.option.menuId ?? defaultIds.menu)) {
        await collectInteraction.deferUpdate();
        resetCollectorTimer();
        this.currentPage = Number(collectInteraction.values[0] ?? 0);
        if (this.currentPage === Number(-3 /* Exit */)) {
          collector.stop();
          return;
        }
        if (this.currentPage === Number(-1 /* Start */)) {
          this.currentPage = 0;
        }
        if (this.currentPage === Number(-2 /* End */)) {
          this.currentPage = this.maxLength - 1;
        }
        const pageEx = await this.getPage(this.currentPage);
        if (!pageEx) {
          throw Error("Pagination: Out of bound page");
        }
        if (pageEx.newMessage.components) {
          pageEx.newMessage.components = [
            ...pageEx.newMessage.components,
            pageEx.paginationRow
          ];
        } else {
          pageEx.newMessage.components = [pageEx.paginationRow];
        }
        await collectInteraction.editReply({ ...pageEx.newMessage, flags: this.option.isV2Components ? "IsComponentsV2" : [] }).catch(() => {
          this.unableToUpdate();
        });
      }
    });
    collector.on("end", async () => {
      const finalPage = await this.getPage(this.currentPage);
      if (message.editable && finalPage && collector.endReason !== "user") {
        if (this.option.ephemeral && this.sendTo instanceof import_discord2.ChatInputCommandInteraction) {
          if (!this._isFollowUp) {
            await this.sendTo.editReply({ components: [] }).catch(() => {
              this.unableToUpdate();
            });
          }
        } else {
          await message.edit({ components: [] }).catch(() => {
            this.unableToUpdate();
          });
        }
      }
      if (this.option.onTimeout) {
        this.option.onTimeout(this.currentPage, message);
      }
    });
    return collector;
  }
};

// src/Resolver.ts
var PaginationResolver = class {
  constructor(resolver, maxLength) {
    this.resolver = resolver;
    this.maxLength = maxLength;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GeneratePage,
  Paginate,
  Pagination,
  PaginationResolver,
  PaginationType,
  SelectMenuPageId,
  defaultIds,
  defaultTime
});
