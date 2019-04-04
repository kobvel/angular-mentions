"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var mention_utils_1 = require("./mention-utils");
var caret_coords_1 = require("./caret-coords");
/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/angular-mentions
 *
 * Copyright (c) 2016 Dan MacFarlane
 */
var MentionListComponent = /** @class */ (function () {
    function MentionListComponent(element) {
        this.element = element;
        this.labelKey = 'label';
        this.itemClick = new core_1.EventEmitter();
        this.items = [];
        this.activeIndex = 0;
        this.hidden = false;
    }
    MentionListComponent.prototype.ngOnInit = function () {
        if (!this.itemTemplate) {
            this.itemTemplate = this.defaultItemTemplate;
        }
    };
    // lots of confusion here between relative coordinates and containers
    MentionListComponent.prototype.position = function (nativeParentElement, iframe, dropUp) {
        if (iframe === void 0) { iframe = null; }
        var coords = { top: 0, left: 0 };
        if (mention_utils_1.isInputOrTextAreaElement(nativeParentElement)) {
            this.blockCursorSize = this.getBlockCursorDimensions(nativeParentElement);
            var scrollToHeightDiff = (nativeParentElement.scrollHeight - nativeParentElement.clientHeight);
            var scrollToWidthDiff = (nativeParentElement.scrollWidth - nativeParentElement.clientWidth);
            // parent elements need to have postition:relative for this to work correctly?
            coords = caret_coords_1.getCaretCoordinates(nativeParentElement, nativeParentElement.selectionStart);
            coords.top = nativeParentElement.offsetTop - scrollToHeightDiff + coords.top + this.blockCursorSize.height;
            coords.left = nativeParentElement.offsetLeft - (scrollToWidthDiff ? scrollToWidthDiff + this.blockCursorSize.width : 0) + coords.left;
        }
        else if (iframe) {
            var context = { iframe: iframe, parent: iframe.offsetParent };
            coords = mention_utils_1.getContentEditableCaretCoords(context);
        }
        else {
            var doc = document.documentElement;
            var scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
            var scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            // bounding rectangles are relative to view, offsets are relative to container?
            var caretRelativeToView = mention_utils_1.getContentEditableCaretCoords({ iframe: iframe });
            var parentRelativeToContainer = nativeParentElement.getBoundingClientRect();
            coords.top = caretRelativeToView.top - parentRelativeToContainer.top + nativeParentElement.offsetTop - scrollTop;
            coords.left = caretRelativeToView.left - parentRelativeToContainer.left + nativeParentElement.offsetLeft - scrollLeft;
        }
        var el = this.element.nativeElement;
        this.list.nativeElement.style.marginBottom = dropUp ? '24px' : null;
        el.className = dropUp ? 'dropup' : null;
        el.style.position = "absolute";
        el.style.left = coords.left + 'px';
        el.style.top = coords.top + 'px';
    };
    Object.defineProperty(MentionListComponent.prototype, "activeItem", {
        get: function () {
            return this.items[this.activeIndex];
        },
        enumerable: true,
        configurable: true
    });
    MentionListComponent.prototype.activateNextItem = function () {
        // adjust scrollable-menu offset if the next item is out of view
        var listEl = this.list.nativeElement;
        var activeEl = listEl.getElementsByClassName('active').item(0);
        if (activeEl) {
            var nextLiEl = activeEl.nextSibling;
            if (nextLiEl && nextLiEl.nodeName == "LI") {
                var nextLiRect = nextLiEl.getBoundingClientRect();
                if (nextLiRect.bottom > listEl.getBoundingClientRect().bottom) {
                    listEl.scrollTop = nextLiEl.offsetTop + nextLiRect.height - listEl.clientHeight;
                }
            }
        }
        // select the next item
        this.activeIndex = Math.max(Math.min(this.activeIndex + 1, this.items.length - 1), 0);
    };
    MentionListComponent.prototype.activatePreviousItem = function () {
        // adjust the scrollable-menu offset if the previous item is out of view
        var listEl = this.list.nativeElement;
        var activeEl = listEl.getElementsByClassName('active').item(0);
        if (activeEl) {
            var prevLiEl = activeEl.previousSibling;
            if (prevLiEl && prevLiEl.nodeName == "LI") {
                var prevLiRect = prevLiEl.getBoundingClientRect();
                if (prevLiRect.top < listEl.getBoundingClientRect().top) {
                    listEl.scrollTop = prevLiEl.offsetTop;
                }
            }
        }
        // select the previous item
        this.activeIndex = Math.max(Math.min(this.activeIndex - 1, this.items.length - 1), 0);
    };
    MentionListComponent.prototype.resetScroll = function () {
        this.list.nativeElement.scrollTop = 0;
    };
    MentionListComponent.prototype.getBlockCursorDimensions = function (nativeParentElement) {
        if (this.blockCursorSize) {
            return this.blockCursorSize;
        }
        var parentStyles = window.getComputedStyle(nativeParentElement);
        return {
            height: parseFloat(parentStyles.lineHeight),
            width: parseFloat(parentStyles.fontSize)
        };
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], MentionListComponent.prototype, "labelKey", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", core_1.TemplateRef)
    ], MentionListComponent.prototype, "itemTemplate", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], MentionListComponent.prototype, "itemClick", void 0);
    __decorate([
        core_1.ViewChild('list'),
        __metadata("design:type", core_1.ElementRef)
    ], MentionListComponent.prototype, "list", void 0);
    __decorate([
        core_1.ViewChild('defaultItemTemplate'),
        __metadata("design:type", core_1.TemplateRef)
    ], MentionListComponent.prototype, "defaultItemTemplate", void 0);
    MentionListComponent = __decorate([
        core_1.Component({
            selector: 'mention-list',
            styles: ["\n      .scrollable-menu {\n        display: block;\n        height: auto;\n        max-height: 300px;\n        overflow: auto;\n      }\n    ", "\n      [hidden] {\n        display: none;\n      }\n    ", "\n      li.active {\n        background-color: #f7f7f9;\n      }\n    "],
            template: "\n    <ng-template #defaultItemTemplate let-item=\"item\">\n      {{item[labelKey]}}\n    </ng-template>\n    <ul #list [hidden]=\"hidden\" class=\"dropdown-menu scrollable-menu\">\n        <li *ngFor=\"let item of items; let i = index\" [class.active]=\"activeIndex==i\">\n            <a class=\"dropdown-item\" (mousedown)=\"activeIndex=i;itemClick.emit();$event.preventDefault()\">\n              <ng-template [ngTemplateOutlet]=\"itemTemplate\" [ngTemplateOutletContext]=\"{'item':item}\"></ng-template>\n            </a>\n        </li>\n    </ul>\n    "
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], MentionListComponent);
    return MentionListComponent;
}());
exports.MentionListComponent = MentionListComponent;
