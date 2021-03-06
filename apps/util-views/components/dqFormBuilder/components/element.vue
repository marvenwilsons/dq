<template>
    <div v-if="hideStatus == false" 
        :class="[...appearanceProperties.fieldElementClasses]" 
        :style="{...appearanceProperties.fieldElementCss}"
      > 
        <div
            v-if="elementProperty.fieldtype == 'custom'"
            :is="elementProperty.name"
            :style="{background:bgColor}"
            :id="myId"
            :class="classes"
            :props="elementProperty.props"
        >
        </div>
        <v-text-field
            dense
            outlined
            v-if="elementProperty.fieldtype == 'string'"
            :placeholder="elementProperty.fieldDescription"
            :label="elementProperty.fieldLabel"
            v-model="inputValue"
            :hide-details="elementProperty.fieldDetails == undefined"
            persistent-hint
            :hint="fieldDetails ? fieldDetails : elementProperty.fieldDetails"
            :error-messages="errorMsg"
            :disabled="disableStatus"
            :style="{background:bgColor}"
            :loading="loadingStatus"
            :id="myId"
            :class="classes"
        ></v-text-field>
        <v-textarea
            dense
            outlined
            v-if="elementProperty.fieldtype == 'textarea'"
            :placeholder="elementProperty.fieldDescription"
            :label="elementProperty.fieldLabel"
            v-model="inputValue"
            :hide-details="elementProperty.fieldDetails == undefined"
            persistent-hint
            :hint="fieldDetails ? fieldDetails : elementProperty.fieldDetails"
            :error-messages="errorMsg"
            :disabled="disableStatus"
            :style="{background:bgColor}"
            :loading="loadingStatus"
            :id="myId"
            :class="classes"
        >
        </v-textarea>
        <v-text-field
            outlined
            dense
            v-if="elementProperty.fieldtype == 'number'"
            :placeholder="elementProperty.fieldDescription"
            :label="elementProperty.fieldLabel"
            v-model="inputValue"
            :hide-details="elementProperty.fieldDetails == undefined"
            persistent-hint
            :hint="fieldDetails ? fieldDetails : elementProperty.fieldDetails"
            type="number"
            :error-messages="errorMsg"
            :disabled="disableStatus"
            :style="{background:bgColor}"
            :loading="loadingStatus"
            :id="myId"
            :class="classes"
        ></v-text-field>
        <v-text-field
            dense
            outlined
            v-if="elementProperty.fieldtype == 'password'"
            :placeholder="elementProperty.fieldDescription"
            :label="elementProperty.fieldLabel"
            v-model="inputValue"
            :hide-details="elementProperty.fieldDetails == undefined"
            persistent-hint
            :hint="fieldDetails ? fieldDetails : elementProperty.fieldDetails"
            type="password"
            :error-messages="errorMsg"
            :disabled="disableStatus"
            :style="{background:bgColor}"
            :loading="loadingStatus"
            :id="myId"
            :class="classes"
        ></v-text-field>
        <v-slider
            dense
            v-if="elementProperty.fieldtype == 'range'"
            v-model="inputValue"
            :label="elementProperty.fieldLabel"
            :hint="fieldDetails ? fieldDetails : elementProperty.fieldDetails"
            :min="dataSet && dataSet.min ? dataSet.min : 0"
            :max="dataSet && dataSet.max ? dataSet.max : 100"
            thumb-label
            persistent-hint
            :error-messages="errorMsg"
            :disabled="disableStatus"
            :style="{background:bgColor}"
            :loading="loadingStatus"
            :id="myId"
            :class="classes"
            ></v-slider>
        <v-switch
            dense
            class="v-input--reverse v-input--expand"
            v-if="elementProperty.fieldtype == 'switch'"
            v-model="inputValue"
            :label="elementProperty.fieldLabel"
            persistent-hint
            :hint="fieldDetails ? fieldDetails : elementProperty.fieldDetails"
            :error-messages="errorMsg"
            :disabled="disableStatus"
            :style="{background:bgColor}"
            :loading="loadingStatus"
            :id="myId"
            :class="classes"
        >
        </v-switch>
        <v-select
            small-chips
            dense
            v-if="elementProperty.fieldtype == 'select'"
            outlined
            :label="elementProperty.fieldLabel"
            :items="dataSet"
            v-model="inputValue"
            persistent-hint
            :hint="fieldDetails ? fieldDetails : elementProperty.fieldDetails"
            :error-messages="errorMsg"
            :disabled="disableStatus"
            :style="{background:bgColor}"
            :loading="loadingStatus"
            :id="myId"
            :class="classes"
        >
        </v-select>
        <v-autocomplete
            small-chips
            dense
            v-if="elementProperty.fieldtype == 'multiselect'"
            v-model="inputValue"
            :items="dataSet"
            chips
            :label="elementProperty.fieldLabel"
            full-width
            multiple
            :hint="fieldDetails ? fieldDetails : elementProperty.fieldDetails"
            persistent-hint
            single-line
            outlined
            :error-messages="errorMsg"
            :disabled="disableStatus"
            :style="{background:bgColor}"
            :loading="loadingStatus"
            :id="myId"
            :class="classes"
        ></v-autocomplete>
    </div>
</template>

<script>
export default {
    props: ['elementProperty','appearanceProperties','formMethods','hostMethods'],
    data: () => ({
        inputValue: undefined,
        dataSet: undefined,
        args: undefined,
        errorMsg: undefined,
        hideStatus: false,
        classes: [],
        disableStatus: false,
        loadingStatus: false,
        bgColor: undefined,
        fieldDetails: undefined,
        myId: undefined,
        elementLabel: undefined
    }),
    mounted() {
        this.elementLabel = this.elementProperty.fieldLabel
        this.inputValue = this.elementProperty.defaultValue
        this.dataSet = this.elementProperty.dataSet
        this.classes.push('dq-input-fontsize')

        this.args = {
            element: {
                hide: this.hide,
                show: this.show,
                addClass: this.addClass,
                removeClass: this.removeClass,
                disable: this.disable,
                setBackgroundColor: this.setBackgroundColor,
                showLoading: this.showLoading,
                setFieldDetails: this.setFieldDetails,
                setFieldId: this.setFieldId,
                error: this.error,
                removeError: this.removeError,
                value: this.inputValue
            },
            schema: {

            },
            prevInput: '',
            error: ''
        }

        for(let key in this.args.element) {
            this.formMethods[this.elementProperty.fieldLabel][key] = this.args.element[key]
        }

        this.$emit('fieldItems', this.formMethods)

        this.elementProperty.onLoad(this.args.element,this.formMethods,this.error)
    },
    watch: {
        inputValue: {
            handler(val) {
                this.args.element.value = val
                for(let key in this.args.element) {
                    this.formMethods[this.elementProperty.fieldLabel][key] = this.args.element[key]
                }
                this.elementProperty.onInput(this.args.element,this.formMethods,this.error)
            },
            deep: true
        }
    },
    methods: {
        error(ErrMSg) {
            this.errorMsg = ErrMSg
            const fieldLabel = this.elementProperty.fieldLabel
            const group = this.elementProperty.group
            if(this.formMethods[group]) {
                this.formMethods[group].map(e => {
                    if(e.fieldLabel == fieldLabel) {
                        e.hasError = true
                    }
                })
            }
        },
        removeError() {
            this.errorMsg = undefined
            const fieldLabel = this.elementProperty.fieldLabel
            const group = this.elementProperty.group
            if(this.formMethods[group]) {
                this.formMethods[group].map(e => {
                    if(e.fieldLabel == fieldLabel) {
                        e.hasError = false
                    }
                })
            }
            
        },
        hide() {
            this.hideStatus = true
            this.$emit('onHide',this.elementProperty.fieldLabel)
        },
        show() {
            this.hideStatus = false
            this.$emit('onShow',this.elementProperty.fieldLabel)
        },
        addClass(ArrayOfClasses) {
            if(typeof ArrayOfClasses == 'string') {
                this.classes.push(ArrayOfClasses)
            } else if(Array.isArray(ArrayOfClasses)) {
                ArrayOfClasses.map(e => {
                    this.classes.push(e)
                })
            }
        },
        removeClass(NameOfClass) {
            this.classes = this.classes.filter(e => {
                if(e != NameOfClass) {
                    return e
                }
            })
        },
        disable(isDisable) {
            this.disableStatus = isDisable
        },
        setBackgroundColor(ColorName) {
            this.bgColor = ColorName
        },
        showLoading(Arg) {
            this.loadingStatus = Arg
            this.disable(Arg)
        },
        setFieldDetails(Details) {
            this.fieldDetails = Details
        },
        setFieldId(Id) {
            this.myId = Id
        }
    }
}
</script>

<style>
.v-input--reverse .v-input__slot {
	 flex-direction: row-reverse;
	 justify-content: flex-end;
}
 .v-application--is-ltr .v-input--reverse .v-input__slot .v-input--selection-controls__input {
	 margin-right: 0;
	 margin-left: 8px;
}
 .v-application--is-rtl .v-input--reverse .v-input__slot .v-input--selection-controls__input {
	 margin-left: 0;
	 margin-right: 8px;
}
 .v-input--expand .v-input__slot .v-label {
	 display: block;
	 flex: 1;
}

.dq-input-fontsize, .v-label{
    font-size: 13px !important;
}

 

</style>