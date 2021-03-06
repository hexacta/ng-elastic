"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/operator/debounceTime");
var Observable_1 = require("rxjs/Observable");
var ElasticDirective = /** @class */ (function () {
    function ElasticDirective(element, ngZone, model) {
        this.element = element;
        this.ngZone = ngZone;
        this.model = model;
        this.onResize = new core_1.EventEmitter();
    }
    ElasticDirective.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.model) {
            return;
        }
        // Listen for changes to the underlying model
        // to adjust the textarea size.
        this.modelSub = this.model
            .valueChanges
            .debounceTime(100)
            .subscribe(function () { return _this.adjust(); });
    };
    ElasticDirective.prototype.ngOnDestroy = function () {
        if (this.modelSub) {
            this.modelSub.unsubscribe();
        }
    };
    ElasticDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.isTextarea(this.element.nativeElement)) {
            this.setupTextarea(this.element.nativeElement);
            return;
        }
        var children = Array.from(this.element.nativeElement.children);
        var textareaEl = children.find(function (el) { return _this.isTextarea(el); });
        if (textareaEl) {
            this.setupTextarea(textareaEl);
            return;
        }
        throw new Error('The `fz-elastic` attribute directive must be used on a `textarea` or an element that contains a `textarea`.');
    };
    ElasticDirective.prototype.onInput = function () {
        // This is run whenever the user changes the input.
        this.adjust();
    };
    ElasticDirective.prototype.isTextarea = function (el) {
        return el.tagName === 'TEXTAREA';
    };
    ElasticDirective.prototype.setupTextarea = function (textareaEl) {
        var _this = this;
        this.textareaEl = textareaEl;
        // Set some necessary styles
        var style = this.textareaEl.style;
        style.overflow = 'hidden';
        style.resize = 'none';
        // Listen for window resize events
        this.ngZone.runOutsideAngular(function () {
            Observable_1.Observable.fromEvent(window, 'resize')
                .debounceTime(100)
                .subscribe(function () { return _this.adjust(); });
        });
        // Ensure we adjust the textarea if
        // content is already present
        this.adjust();
    };
    ElasticDirective.prototype.adjust = function () {
        if (!this.textareaEl) {
            return;
        }
        var previousHeight = parseInt(this.textareaEl.style.height, 10);
        this.textareaEl.style.height = '1px';
        var newHeight = this.textareaEl.scrollHeight;
        this.textareaEl.style.height = 'auto';
        this.textareaEl.style.height = newHeight + "px";
        if (previousHeight !== newHeight) {
            // send resize event
            this.onResize.emit(newHeight);
        }
    };
    ElasticDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[fz-elastic]'
                },] },
    ];
    /** @nocollapse */
    ElasticDirective.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.NgZone, },
        { type: forms_1.NgModel, decorators: [{ type: core_1.Optional },] },
    ]; };
    ElasticDirective.propDecorators = {
        'onResize': [{ type: core_1.Output, args: ['on-resize',] },],
        'onInput': [{ type: core_1.HostListener, args: ['input',] },],
    };
    return ElasticDirective;
}());
exports.ElasticDirective = ElasticDirective;
