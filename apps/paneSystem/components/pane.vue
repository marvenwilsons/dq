<template>
    <v-expand-transition>
        <v-flex transition="slide-x-transition" v-if="ready" flexcol >
        <div 
            style="background: #f5f7fa"
            class="pad025" >
                <v-flex spacebetween >
                    <div class="fullwidth flex" style="color:whitsmoke" >
                        <div class="marginright050" >
                            <v-chip color="var(--deftheme-light-primary)" outlined text-color="#292929" >
                                {{$store.state.pane[paneIndex].paneConfig.paneName}}
                            </v-chip>
                        </div>

                    </div>
                    <div class="flex" v-if="$store.state.pane[paneIndex].paneConfig.isClosable" >
           
                        <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                                <v-chip  v-on="on" class=" pointer" outlined color="var(--deftheme-light-primary)" >
                                    <v-icon small color="#505050">
                                        mdi-cog
                                    </v-icon>
                                </v-chip>
                            </template>
                            <v-list>
                                <v-list-item
                                v-for="(item, index) in myPaneSettings"
                                :key="index"
                                @click="showPaneSettings(item)"
                                >
                                <v-list-item-title>{{ item }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <v-chip outlined color="var(--deftheme-light-primary)">
                            <span 
                                @click="closePane(`${$store.state.pane[paneIndex].paneConfig.paneName.toLowerCase().replace(' ','')}${paneIndex}`)"
                                class="pointer"
                                style="color:#505050; font-weight:100" >
                            	&#x2716;
                            </span>
                        </v-chip>

                    </div>
                </v-flex>
        </div>
        <v-flex flex1 relative flexcol >
            <!-- pane modal -->
            <transition name="slide-fade">
                <v-flex
                    v-if="$store.state.pane[paneIndex].paneConfig.modal.modalBody != undefined"  
                    style="z-index:900" absolute flexcenter fullwidth fullheight-percent >
                    <main 
                        
                        :style="{
                                width: $store.state.pane[paneIndex].paneConfig.modal.modalWidth ? 
                                    $store.state.pane[paneIndex].paneConfig.modal.modalWidth : '70%',
                                maxHeight: '90%',
                                background: 'white'
                            }" 
                        class="borderRad4 modalShadow" >
                        <div :style="{'background': $vuetify.theme.themes.light.primary, 'color':'white'}" class="pad050" >
                            <v-flex spacebetween>
                                <span>{{$store.state.pane[paneIndex].paneConfig.modal.modalHeader}}</span>
                                <span
                                    v-if="$store.state.pane[paneIndex].paneConfig.modal.isClosable"
                                    @click="closePaneModal(paneIndex)"
                                    class="pointer"
                                    style="color:#505050; font-weight:100" >
                                        &#x2716;
                                </span>
                            </v-flex>
                        </div>
                        <v-flex style="background:#fafafa;" pad125 flexcol borderRad4 >
                            <!-- modal Error -->
                            <div
                                v-if="$store.state.pane[paneIndex].paneConfig.modal.modalErr" 
                                class="backgrounderr err borderRad4 pad050 marginbottom125" >
                                {{$store.state.pane[paneIndex].paneConfig.modal.modalErr}}
                            </div>
                            <!-- modal Info -->
                            <div
                                v-if="$store.state.pane[paneIndex].paneConfig.modal.modalInfo" 
                                class="backgroundinfo borderRad4 pad050 marginbottom125" >
                                {{$store.state.pane[paneIndex].paneConfig.modal.modalInfo}}
                            </div>
                            <!-- custom modals -->
                            <div 
                                v-if="!['logWarn','logErr','logInfo','logPrompt'].includes($store.state.pane[paneIndex].paneConfig.modal.modalBody)"
                                :is="$store.state.pane[paneIndex].paneConfig.modal.modalBody" 
                                :myConfig="$store.state.pane[paneIndex].paneConfig.modal.modalConfig" 
                                :paneIndex="paneIndex" 
                                :submitHandler="onModalData">
                            </div>
                            <!-- logs -->
                            <div
                                v-if="['logWarn','logErr','logInfo'].includes($store.state.pane[paneIndex].paneConfig.modal.modalBody)"
                                >
                                <div 
                                    :class="['pad050', 'borderRad4',
                                            $store.state.pane[paneIndex].paneConfig.modal.modalBody == 'logErr' && 'backgrounderr',
                                            $store.state.pane[paneIndex].paneConfig.modal.modalBody == 'logInfo' && 'backgroundinfo',
                                            $store.state.pane[paneIndex].paneConfig.modal.modalBody == 'logWarn' && 'backgroundwarn',
                                        ]" 
                                    >
                                    <div class="pad025" >
                                        {{$store.state.pane[paneIndex].paneConfig.modal.modalConfig.msg}}
                                    </div>
                                </div>
                                <v-flex margintop125 flexend>
                                    <v-btn @click="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.fn" color="primary" >
                                        continue
                                    </v-btn>
                                </v-flex>
                            </div>
                            <!-- panePrompt -->
                            <div v-if="$store.state.pane[paneIndex].paneConfig.modal.modalBody === 'logPrompt'" >   
                                <div v-if="
                                    $store.state.pane[paneIndex].paneConfig.modal.modalConfig.type === 'string' || 
                                    $store.state.pane[paneIndex].paneConfig.modal.modalConfig.type === 'number' ||
                                    $store.state.pane[paneIndex].paneConfig.modal.modalConfig.type === 'password'
                                    "
                                    >
                                    <v-text-field
                                        class="dq-input-fontsize"
                                        id="inyp"
                                        :disabled="isLoading"
                                        v-model="logPromptData"
                                        dense
                                        :type="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.type"
                                        :label="$store.state.pane[paneIndex].paneConfig.modal.modalHeader"
                                        outlined
                                    />
                                </div>
                                <div v-if="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.type === 'select' " >
                                    <v-select
                                        class="dq-input-fontsize"
                                        dense
                                        v-model="logPromptData"
                                        :items="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.value"
                                        :label="$store.state.pane[paneIndex].paneConfig.modal.modalHeader"
                                        :disabled="isLoading"
                                        outlined
                                    ></v-select>
                                </div>
                                <div v-if="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.type === 'multiselect' " >
                                    <v-combobox
                                        dense
                                        class="dq-input-fontsize"
                                        chips
                                        v-model="logPromptData"
                                        :items="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.value"
                                        :label="$store.state.pane[paneIndex].paneConfig.modal.modalHeade"
                                        :disabled="isLoading"
                                        multiple
                                    ></v-combobox>
                                </div>
                                <div class="padtop125" v-if="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.type === 'slider' " >
                                    <v-slider
                                        dense
                                        class="dq-input-fontsize"
                                        v-model="logPromptData"
                                        :thumb-size="24"
                                        thumb-label="always"
                                        :min="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.value.min"
                                        :max="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.value.max"
                                        :disabled="isLoading"
                                    ></v-slider>
                                </div>
                                <div class="padtop125" v-if="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.type === 'minmax' " >
                                    <v-range-slider
                                        :value="logPromptData"
                                        :max="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.value.max"
                                        :min="$store.state.pane[paneIndex].paneConfig.modal.modalConfig.value.min"
                                        :disabled="isLoading"
                                        thumb-label="always"
                                        @end="logPromptData = $event"
                                        range
                                    />
                                </div>
                                <loading @progressMethod="p => progress = p" />
                                <v-flex flexend >
                                    <v-btn
                                        color="primary" 
                                        @click="paneModalCb()"
                                        :loading="$store.state.pane[paneIndex].paneConfig.modal.modalErr ? false : isLoading"
                                        >
                                        submit</v-btn>
                                </v-flex>
                            </div>
                        </v-flex>
                    </main>
                </v-flex>
            </transition>
            <!-- pane body -->
            <v-flex>
                <div 
                    :id="`${paneIndex}-${$store.state.pane[paneIndex].paneConfig.paneName}`" 
                    :myConfig="$store.state.pane[paneIndex].componentConfig" 
                    :paneIndex="paneIndex" 
                    :is="$store.state.pane[paneIndex].paneConfig.paneViews[$store.state.pane[paneIndex].paneConfig.defaultPaneView]" 
                    :myData="$store.state.pane[paneIndex].paneConfig.paneData" 
                    @onEvent="onEvent"
                    >
                </div>
            </v-flex>
        </v-flex>
        </v-flex>
    </v-expand-transition>
</template>

<script>
import h from '@/helper'
import templates from '@/templates'
import utils from '@/utils'

export default {
    mixins: [h],
    props: ['myData','paneIndex'],
    created() {
        this.h = this
    },
    data:() => ({
        logPromptData: undefined,
        isLoading: false,
        progress: undefined,
        dep: undefined,
        myPaneSettings: ['show raw data', 'switch view'],
        ready: false
    }),
    computed: {
        paneModal() {
            if(this.$store.state.pane[this.paneIndex]) {
                return this.$store.state.pane[this.paneIndex].paneConfig.modal
            }
        },
    },
    watch: {
        paneModal() {
            this.isLoading = false
            try {
                this.logPromptData = this.$store.state.pane[this.paneIndex].paneConfig.modal.modalConfig.defaultValue
            }catch(err) {} 
        },
        logPromptData() {
            this.isLoading = false
            this.$store.commit('paneModalUpdate', {
                paneIndex: this.paneIndex,
                payload: {
                    key: 'modalErr',
                    value: undefined
                }
            })
        }
    },
    mounted() {
        this.dep = this.normyDep(this.paneIndex,this)
        const {syspane,syspanemodal,dwin} = this.dep
        this.$store.state.pane[this.paneIndex].paneConfig.paneOnLoad(syspane,syspanemodal,dwin)
        this.autoScroll()

        console.log('mouted')
        this.ready = true
    },
    methods: {
        onModalData(data) {
            const { syspane, syspanemodal, dwin} =  this.dep
            this.$store.state.pane[this.paneIndex].paneConfig.modal.onModalData(data,syspane,syspanemodal,dwin)
        },
        onEvent(e) {
            const {syspane,syspanemodal,dwin} = this.dep
            if(e.eventName) {
                const event = {
                    eventName: e.eventName,
                    context: e.context
                }
                if(this.$store.state.pane[this.paneIndex].paneConfig.onEvent != undefined) {
                    const targetFn = this.$store.state.pane[this.paneIndex].paneConfig.onEvent(event,syspane,syspanemodal,dwin, this.$axios)
                    if(targetFn[e.eventName]) {
                        targetFn[e.eventName](e.methods)
                    }
                } else {
                    this.systemError('onEvent Error, Cannot find onEvent hook in serviceObject')
                }
            } else {
                this.systemError('onEvent Error eventName is undefined')
            }
        },
        paneModalCb() {
            this.isLoading = true
            if(this.$store.state.pane[this.paneIndex].paneConfig.modal.modalConfig.type === 'number'){
                if(isNaN(parseInt(this.logPromptData))) {
                    this.appendErrorMsg(this.paneIndex,'Invalid input type, it should be a type of number')
                } else {
                    this.$store.state.pane[this.paneIndex].paneConfig.modal.modalConfig.fn(
                        parseInt(this.logPromptData),
                        this.progress,
                        msg => {
                            this.actions.syspane.modal.appendErrorMsg(this.paneIndex,msg)
                            this.isLoading = false
                        }
                    )
                }
            } else {
                this.$store.state.pane[this.paneIndex].paneConfig.modal.modalConfig.fn(
                    this.logPromptData,
                    this.progress,
                    msg => {
                        this.actions.syspane.modal.appendErrorMsg(this.paneIndex,msg)
                        this.isLoading = false
                    }
                )
            }
        },
        showPaneSettings(sel) {
            // show raw data, views
            
            if(sel == 'show raw data') {
                const rawIndex = this.$store.state.pane[this.paneIndex].paneConfig.paneViews.indexOf('raw')
                if(rawIndex != -1) {
                    this.updatePaneConfig(this.paneIndex, {
                        key: 'defaultPaneView',
                        value: rawIndex
                    })
                    setTimeout(() => {
                        this.myPaneSettings = ['back to default view']
                    }, 150);
                } else {
                    const v = this.cp(this.$store.state.pane[this.paneIndex].paneConfig.paneViews)
                    v.push('raw')
                    this.updatePaneConfig(this.paneIndex, {
                        key: 'paneViews',
                        value: v
                    })

                    this.showPaneSettings('show raw data')
                }
            } else if(sel == 'back to default view') {
                this.updatePaneConfig(this.paneIndex, {
                    key: 'defaultPaneView',
                    value: 0
                })
                setTimeout(() => {
                    this.myPaneSettings = ['show raw data', 'switch view']
                }, 150);
            } else if(sel == 'switch view') {
                // switch view
                this.actions.syspane.prompt(this.paneIndex,{
                    type: 'select',
                    header: 'Switch Views',
                    value: this.$store.state.pane[this.paneIndex].paneConfig.paneViews,
                    defaultValue: this.$store.state.pane[this.paneIndex].paneConfig.paneViews[0], // can be null
                    info: 'Select a view', // can be null
                    isClosable:  true
                }, (input,progress,error) => {
                    this.updatePaneConfig(this.paneIndex, {
                        key: 'defaultPaneView',
                        value: this.$store.state.pane[this.paneIndex].paneConfig.paneViews.indexOf(input)
                    })

                    this.actions.syspane.modal.close(this.paneIndex)
                })
            }
        }
    }
}
</script>

<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(15px);
  opacity: 0;
}

.closeAnimation {
  -webkit-animation: ca 0.5s linear; /* Safari */
  animation: ca 0.5s linear;
}

@keyframes ca {
    0% { opacity: 100%;}
    60% { transform: scale(0)}
    100%{ opacity: 0%;}
}
</style>