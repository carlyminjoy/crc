<template>
    
    <div class="category" >

        <div class='category-heading'
            @click='expanded = !expanded'>
            
            <div class='heading-container'>
                <span>
                <span class='img-container'><img :src='icons[category.name]' /></span>
                {{ category.name.toUpperCase() }}</span>

                <span class='category-icons'>
                    <span v-if='category.bad.length === 0'><i class='fa fa-check-circle'></i></span>

                    <template v-if='category.bad.length > 0'>
                        <span class='numbered-exclamation'>{{category.bad.length}} &nbsp;</span>
                        <i class='fa fa-exclamation-circle'></i>
                    </template>
                </span>
            </div>

            <span class='expand-tag'>
                <i v-if='!expanded' class='fa fa-chevron-down'></i>
                <i v-else class='fa fa-chevron-up'></i>
            </span>

        </div>

        <div class="blue" :class="{'contracted' : !expanded}" v-if="category.good.length > 0">

            <h2>You're doing great in the following areas:</h2>

            <ul>
                <li v-for="(section, i) in category.good" :key="i">
                    <i class='fa fa-check'></i>
                    <p>{{ section.answer }}
                        <span v-if='section.bmi'><strong><br><br>Your BMI is: {{ section.bmi }}.<br><br>
                        The recommended range is between 18.5 and 25.</strong>
                        </span>
                    </p>
                </li>
            </ul>

        </div>

        <div class="grey" :class="{'contracted' : !expanded}" v-if="category.bad.length > 0">
            <h2>Areas for improvement:</h2>
            <ul class='improvements'>
                <li v-for="(section, i) in category.bad" :key="i">
                    <i class='fa fa-exclamation-circle'></i> &nbsp;
                    <p> {{ section.answer }} <br>
                        <strong>
                            <span v-if='section.bmi'><br>Your BMI is: {{ section.bmi }}.<br><br></span>
                            <span v-html='section.recommendation'>
                        </strong>
                    </p>
                </li>
            </ul>

            <template v-if="category.tips">
                <h2 class="m0">Tips:</h2>
                <ul class="tips">
                    <li v-for="(tip,index) in category.tips" :key="index" v-html='tip'></li>
                </ul>
            </template>

        </div>

        <div v-if='filteredResources(category).length > 0' class='resources-container' :class="{'contracted' : !expanded}">

            <h2>Resources and links:</h2>
            <ul class="resources">

                <li v-for="(resource, index) in filteredResources(category)" :key='index'>
                    
                    <a class='img-link' :class="{ 'download' : resource.download, 'fullwidth' : resource.fullwidth }" :href='resource.url' target='_blank' v-bind:style="{ backgroundImage: 'url(' + resource.img + ')' }"></a>
                    <div>
                        <p>{{ resource.text }}</p>
                        <a :href='resource.url' target='_blank'>{{ resource.cta }}</a>
                    </div>
                </li>

            </ul>

        </div>
    </div>
</template>

<script>

import { default as Tips } from './tips.js'
import { default as Icons } from './icons.js'
import { default as Resources } from './resources.js'

export default {
    name: 'category',
    props: ['category', 'index', 'gender'],
	data () {
		return {
            tips: Tips,
            resources: Resources,
            expanded: false,
            icons: Icons
		}
    },
    methods: {
        filteredResources(category) {
            let vm = this;
            return vm.resources[category.name].filter(r => vm.showResource(r, category))
        },
        showResource(resource, category) {
            let vm = this;

            let matchingQuestionId = category.bad.map(q => q.id).includes(resource.questionId)
            let matchingGender = vm.gender === resource.gender
            let conditionalDisplay = resource.hasOwnProperty('questionId') || resource.hasOwnProperty('gender')

            return !conditionalDisplay || matchingQuestionId || matchingGender
        }
    }
}
</script>


<style lang='scss'>

$blue: #0099DA;
$yellow: #FCD208;
$dark-blue: #2c3e50;

%boxshadow {
    -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    -moz-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    -ms-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    -o-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.09), 0 3px 3px rgba(0, 0, 0, 0.12);
}

.category {
    background: #eee;
    color: #fff;
    margin: 15px;
    @extend %boxshadow;
    border-radius: 8px;
    text-align:left;
    transition: 0.3s;

    .category-heading {
        &:hover {
            background: $blue;
            cursor:pointer;
        
            & > div.heading-container span.category-icons .fa-check-circle {
                color:#fff;
            }
        }
        background: $dark-blue;
        transition: 0.3s ease;
        border-radius: 8px 8px 0 0;
        display:flex;
        justify-content:stretch;


        .img-container {
            width: 40px;
            text-align:center;
            display:inline-block;
            height: 40px;
            justify-content:center;
            align-items:center;
            margin-right: 15px;

            img {
                margin-top: 2px;
                height:36px;
            }
        }

        &>div.heading-container {
            color:#fff;
            padding: 10px 30px;
            margin: 0;
            flex-basis: 300px;
            flex-grow: 1;
            display:flex;
            align-items:center;
            justify-content:space-between;
            font-size: 24px;
            font-family: 'Foco CC', 'Roboto', Arial, sans-serif;

            &>span:not(.category-icons) {
                display:flex;
                align-items:center;
                line-height: 20px;
            }
            span.category-icons {
                float:right;
                width: 60px;
                display:flex;
                pointer-events:none;
                // align-items:center;
                justify-content:flex-end;

                .blue-text {
                    color: $blue;
                }

                .yellow-text {
                    // color: $yellow;
                    color:$dark-blue;
                    background:$yellow;
                    width: 25px;
                    height:25px;
                    border-radius: 50%;
                    text-align:center;
                    line-height:25px;
                    font-size: 18px;
                    font-weight: 800;
                }

                .fa-check-circle {
                    color: $blue;
                    transition: 0.3s ease;
                }

                .fa-exclamation-circle {
                    color: $yellow;
                }
            }
        }

        span.expand-tag {
            flex-basis: 40px;
            max-width: 40px;
            flex-shrink:1;
            padding: 5px 10px;
            color:#fff;
            font-size: 24px;
            border-radius: 0 8px 0 0;
            transition: 0.5s ease;
            text-align:center;
            display:flex;
            align-items:center;
            justify-content:center;

            &.yellow-expand {
                background:$yellow;
            }

            &:hover {
                opacity: 0.7;
                cursor:pointer;
            }
        }
    }

    &>h2 {
        padding: 15px 30px;
        margin: 0;
        color:#fff;
    }

    p, li {
        margin: 0 0 4px 0;
        font-size: 16px!important;
    }

    .blue, .grey, .resources-container {
        transition: max-height 0.5s ease, opacity 0.5s ease;
        padding: 15px 30px;
        max-height: 3000px;

        .fa, .svg-inline--fa {
            font-size: 20px!important;
        }
    }

    .blue.contracted, .grey.contracted, .resources-container.contracted {
        transition: max-height 0.5s ease, opacity 0.5s ease;
        padding: 0;
        margin:0;
        opacity: 0;
        max-height: 0px;
        height:0;
        pointer-events:none;

        * {
            margin: 0;
            padding: 0;
            opacity: 0;
            max-height: 0;
        }

        ul, li {
            display:none!important;
        }
    }

    .blue > div,
    .grey > div {
        display:flex;
        flex-wrap:wrap;
        padding: 10px 15px 0 0;

        p {
            flex-basis: 200px;
            min-width: 200px;
            flex-grow: 1;
        }
    }

    .blue {
        background: $blue;
        color:#fff;

        h2 {
            color:#fff;
        }

        ul {
            display:flex;
            flex-wrap: wrap;
        
            li{
                flex-basis: 380px;
                flex-grow:1;
                min-width: 380px;
                margin: 5px 0;
                display:flex;
                .fa, .svg-inline--fa {
                    font-size: 20px;
                    color:#fff;
                    margin-right: 15px;
                }

                p {
                    margin: 0;
                }
            }
        }

    }

    .grey {
        background:$yellow;
        color:$dark-blue;

        & > div {
            margin: 20px auto;
            border-top: 1px solid #dcdcdc;
        }

        ul.tips {
            margin-top: 10px;
            padding-inline-start:20px;
        }

        ul.improvements {
            list-style-type:none;
            display:flex;
            flex-wrap:wrap;

            li {
                flex-basis: 380px;
                flex-grow:1;
                min-width: 380px;
                margin: 5px 30px 5px 0;
                display:flex;

                .fa, .svg-inline--fa {
                    margin-right: 15px;
                    font-size: 24px;
                }
            }
        }

        a {
            text-decoration:none;
            color:$blue;
            font-weight:bold;
        }

    }
    .resources-container {
        background:#eee;
        color:$dark-blue;
        padding: 15px 30px 30px 30px;

        .resources {
            display:flex;
            list-style-type:none;
            padding-inline-start:0;
            margin-block-start:0;
            flex-wrap:wrap;

            li {
                background:white;
                @extend %boxshadow;
                margin:10px;
                padding:0;
                min-width:320px;
                flex-basis: 320px;
                flex-grow:1;
                display:flex;
                max-width: 350px;

                a.img-link {
                    padding:0;
                    margin:0;
                    height:100%;
                    flex-basis:45%;
                    flex-grow:1;
                    background-size:contain;

                    &.download {
                        background-repeat:no-repeat;
                        background-color: $blue;
                        background-position: center;
                    }

                    &.fullwidth {
                        flex-basis: 100%;
                        width: 100%;
                    }
                }
                div {
                    padding: 30px;
                    flex-basis:45%;
                    flex-grow:1;
                    display:flex;
                    flex-direction:column;

                    a {
                        text-align:center;
                        background:$blue;
                        color:#fff;
                        text-decoration:none;
                        transition:0.3s ease;
                        padding: 8px 20px;
                        border-radius: 4px;
                        margin-top: 10px;
                        @extend %boxshadow;

                        &:hover {
                            filter: brightness(0.8);
                        }
                    }
                }
                display:flex;
                align-items:center;
            }
        }
    }
}

@media screen and (max-width: 600px) {
    .category {
        &.break::after {
            width: calc(100% - 30px);
        }

        .category-heading > div.heading-container {
            font-size: 20px;
            padding: 5px 10px;

            span.img-container > img {
                height: 30px;
                margin-top: 4px;
            }

            .category-icons {
                span.yellow-text {
                    display:none;
                }
                i.fa-exclamation-circle {
                    display:inline-block;
                }
            }
        }
        .resources-container .resources li {
            flex-wrap:wrap;
                a.img-link {
                    height:150px;
                }
        }
    }

    @media screen and (max-width: 800px) {         
        .category {
            margin: 15px 0;

            .category-heading {
                font-size: 16px;

                & > div.heading-container {
                    font-size: 16px;
                    padding: 5px 0 5px 10px;

                    span.img-container {
                        margin-right: 10px;
                    }
                }

                span.category-icons {
                    min-width: 30px;
                    width: 30px;
                    align-items:center;

                    .numbered-exclamation {
                        height: 16px;
                        font-size: 16px;
                    }
                }
            }
            .grey, .blue, .resources-container {
                ul {
                    padding-inline-start:0;

                    li {
                        min-width:unset;
                    }
                } 
            }
        }
    }
}

</style>