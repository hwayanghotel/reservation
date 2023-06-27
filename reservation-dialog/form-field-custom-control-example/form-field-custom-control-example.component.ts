import { FocusMonitor } from "@angular/cdk/a11y";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { Component, ElementRef, Inject, Input, OnDestroy, Optional, Self, ViewChild, forwardRef } from "@angular/core";
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NgControl,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl, MatFormFieldModule } from "@angular/material/form-field";
import { Subject } from "rxjs";
import { MatIconModule } from "@angular/material/icon";
import { ReservationService } from "reservation/service/reservation.service";

/** @title Form field with custom telephone number input control. */
@Component({
    selector: "form-field-custom-control-example",
    templateUrl: "form-field-custom-control-example.component.html",
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, forwardRef(() => MyTelInput), MatIconModule],
})
export class FormFieldCustomControlExample {
    form: FormGroup = new FormGroup({
        tel: new FormControl(new MyTel("", "", "")),
    });
}

/** Data structure for holding telephone number. */
export class MyTel {
    constructor(public area: string, public exchange: string, public subscriber: string) {}
}

/** Custom `MatFormFieldControl` for telephone number input. */
@Component({
    selector: "example-tel-input",
    templateUrl: "./example-tel-input-example.html",
    styleUrls: ["./example-tel-input-example.scss"],
    providers: [{ provide: MatFormFieldControl, useExisting: MyTelInput }],
    host: {
        "[class.example-floating]": "shouldLabelFloat",
        "[id]": "id",
    },
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
})
export class MyTelInput implements ControlValueAccessor, MatFormFieldControl<MyTel>, OnDestroy {
    static nextId = 0;
    @ViewChild("area") areaInput: HTMLInputElement;
    @ViewChild("exchange") exchangeInput: HTMLInputElement;
    @ViewChild("subscriber") subscriberInput: HTMLInputElement;

    parts: FormGroup<{
        area: FormControl<string | null>;
        exchange: FormControl<string | null>;
        subscriber: FormControl<string | null>;
    }>;
    stateChanges = new Subject<void>();
    focused = false;
    touched = false;
    controlType = "example-tel-input";
    id = `example-tel-input-${MyTelInput.nextId++}`;
    onChange = (_: any) => {};
    onTouched = () => {};

    get empty() {
        const {
            value: { area, exchange, subscriber },
        } = this.parts;

        return !area && !exchange && !subscriber;
    }

    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }

    @Input("aria-describedby") userAriaDescribedBy: string;

    @Input()
    get placeholder(): string {
        return this._placeholder;
    }
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    private _placeholder: string;

    @Input()
    get required(): boolean {
        return this._required;
    }
    set required(value: BooleanInput) {
        this._required = coerceBooleanProperty(value);
        this.stateChanges.next();
    }
    private _required = false;

    @Input()
    get disabled(): boolean {
        return this._disabled;
    }
    set disabled(value: BooleanInput) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.parts.disable() : this.parts.enable();
        this.stateChanges.next();
    }
    private _disabled = false;

    @Input()
    get value(): MyTel | null {
        if (this.parts.valid) {
            const {
                value: { area, exchange, subscriber },
            } = this.parts;
            return new MyTel(area!, exchange!, subscriber!);
        }
        return null;
    }
    set value(tel: MyTel | null) {
        const { area, exchange, subscriber } = tel || new MyTel("", "", "");
        if (!(this._existCompleteTel() && this._initial(tel))) {
            this.parts.setValue({ area, exchange, subscriber });
            this.stateChanges.next();
        }
    }

    private _existCompleteTel() {
        return (
            this.parts.value.area.length === 3 &&
            this.parts.value.exchange.length === 4 &&
            this.parts.value.subscriber.length === 4
        );
    }

    private _initial(tel: MyTel | null): boolean {
        const { area, exchange, subscriber } = tel || new MyTel("", "", "");
        return area.length === 0 && exchange.length === 0 && subscriber.length === 0;
    }

    get errorState(): boolean {
        return this.parts.invalid && this.touched;
    }

    constructor(
        formBuilder: FormBuilder,
        private _focusMonitor: FocusMonitor,
        private _elementRef: ElementRef<HTMLElement>,
        @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
        @Optional() @Self() public ngControl: NgControl,
        private reservationService: ReservationService
    ) {
        if (this.ngControl != null) {
            this.ngControl.valueAccessor = this;
        }

        this.parts = formBuilder.group({
            area: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
            exchange: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
            subscriber: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
        });

        this.reservationService.formData$.subscribe((model) => {
            if (model["전화번호"]) {
                const tel = model["전화번호"].split("-");
                const { area, exchange, subscriber } = new MyTel(tel[0], tel[1], tel[2]);
                this.parts.setValue({ area, exchange, subscriber });
            }
        });
    }

    ngOnDestroy() {
        this.stateChanges.complete();
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    onFocusIn(event: FocusEvent) {
        if (!this.focused) {
            this.focused = true;
            this.stateChanges.next();
        }
    }

    onFocusOut(event: FocusEvent) {
        if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
            this.touched = true;
            this.focused = false;
            this.onTouched();
            this.stateChanges.next();
        }
    }

    autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
        if (!control.errors && nextElement) {
            this._focusMonitor.focusVia(nextElement, "program");
        }
    }

    autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
        if (control.value.length < 1) {
            this._focusMonitor.focusVia(prevElement, "program");
        }
    }

    setDescribedByIds(ids: string[]) {
        const controlElement = this._elementRef.nativeElement.querySelector(".example-tel-input-container")!;
        controlElement.setAttribute("aria-describedby", ids.join(" "));
    }

    onContainerClick() {
        if (this.parts.controls.subscriber.valid) {
            this._focusMonitor.focusVia(this.subscriberInput, "program");
        } else if (this.parts.controls.exchange.valid) {
            this._focusMonitor.focusVia(this.subscriberInput, "program");
        } else if (this.parts.controls.area.valid) {
            this._focusMonitor.focusVia(this.exchangeInput, "program");
        } else {
            this._focusMonitor.focusVia(this.areaInput, "program");
        }
    }

    writeValue(tel: MyTel | null): void {
        this.value = tel;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
        this.autoFocusNext(control, nextElement);
        this.onChange(this.value);

        if (this.value) {
            this.reservationService.setReservationForm({
                ...this.reservationService.formData$.getValue(),
                전화번호: `${this.value.area}-${this.value.exchange}-${this.value.subscriber}`,
            });
        }
    }
}
