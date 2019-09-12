@api Objectify Flat Settings

<objectifyFlatSettings
    @onChange="methodName"
    @onError="methodName"
    operation="rw"
    :inputData="sample"
    :title="'Sample Title'"
    :options="{
        padding: 'small', // small med big
        textColor: '',
        borderColor: 'gray'
    }"
></objectifyFlatSettings>

## Events      
    onChange
    onError

## Input props         Type        Required
    inputData           object      yes
    title               string      optional
    options             object      optional
    operation           string      yes

## Options             Type        Options             Default     Required
    padding             string      small, med, big     0           optional
    textColor           string      -                   inherit     optional
    borderColor         string      -                   gray        optional


## Sample inputData
    sample: {
        "isLock": {
            type: "select", 
            options: [true, false], 
            default: 0 
        },
        lightness: {
            type: "number",
            min: 0, 
            max: 50, 
            step: 5, 
            default: 20 
        },
        name_2: {
            type: "string", 
            minChar: 10, 
            maxChar: 15, 
            allowSpecialChars: false, 
            allowWhiteSpace: false, 
            default: "marven" 
        }
    }