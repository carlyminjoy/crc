<template>
	<div id="app">
        <header>
            <div class='container'>
                <img src="https://cancerqld.blob.core.windows.net/content/code/global/img/ccq-logo-249x123.png" />
                <h1>Cancer Risk Score Card</h1>
            </div>
        </header>

        <div class="outer-container">

            <div class="results-container">
                <h3>{{ results}} Your total score is:</h3>

                <vue-circle
                    :progress="results.total || 65"
                    :size="150"
                    :reverse="false"
                    line-cap="butt"
                    :fill='{ gradient: ["#43A047", "#FCD208"], gradientDirection:[30,140,140,60] }'
                    empty-fill="#eee"
                    :animation-start-value="0.0"
                    :start-angle="-(Math.PI / 2)"
                    insert-mode="append"
                    :thickness="10"
                    :show-percent="true">

                </vue-circle>

            </div>
        </div>
	</div>
</template>

<script>
import { vmdButton } from '@ccq/ccq-vue-components'
import VueCircle from 'vue2-circle-progress'

export default {
    name: 'app',
    components: {
        vmdButton,
        VueCircle
    },
	data () {
		return {
            results: {}
		}
    },
    methods: {
        getScoreCard() {
            let vm = this;

            
        }
    },
    mounted () {
        let vm = this;

        vm.getScoreCard();
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

body {
    margin: 0;
    padding: 0;
    // overflow-y:hidden;
}
#app {
	font-family: 'Foco CC', 'Roboto', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: $dark-blue;
	// padding: 30px;
    height:100vh;
    background: #eee;

    header {
        height:80px;
        background: #fff;
        // border-bottom: 3px solid #FCD208;

        .container {
            height:100%;
            max-width: 660px;
            margin: 0 auto;
            img {
                float:left;
                height: 50px;
                margin-top: 15px;
            }
            h1 {
                color: $dark-blue;
                font-family:'Foco CC', 'Roboto', Arial, sans-serif;
                margin: 0 104px 0 0;
                letter-spacing: 0;
                line-height: 90px;
            }
        }

    }

}

.outer-container {
    background:#eee;
}

.results-container {
    background:#fff;
    padding: 15px 30px;
    border-radius: 8px 8px 8px 0;
    max-width: 600px;
    margin: 50px auto;
    height: auto;
    @extend %boxshadow;

    .circle {
        margin: 30px auto;
    }

    form {
        display:flex;
        flex-wrap: wrap;
        justify-content:space-between;

        div.mdc-text-field {
            flex-grow: 1;
            margin: 5px;
            flex-basis: 100%;

            &.half-width {
                min-width: 200px;
                flex-basis: 250px;
            }
        }

        p {
            margin: 20px auto;

            a {
                text-decoration:none;
                font-weight:bold;
                color:$blue;
            }
        }

        button {
            width: 100%;
            margin-bottom: 10px;
        }
    }


    ul {
        list-style-type:none;
        padding-inline-start: 0;
        margin-block-start: 0;
        display:flex;
        flex-wrap: wrap;
        justify-content:center;
        margin-bottom: 30px;

        li {
            text-transform:capitalize;
            flex-basis: 25%;
            flex-grow: 1;
            border-radius: 4px;
            margin: 1%;
            color: #fff;
            text-align:center;
            background: $blue;
            padding: 30px 15px 5px 15px;
            min-width: 100px;
            max-width: 165px;
            @extend %boxshadow;

            i {
                font-size: 32px;
            }
        }
    }
}

@media screen and (max-width: 800px) {
    #app {
        header {
            height: 60px;
            .container {
                display:flex;
                align-items:center;
                h1 {
                    padding-top: 5px;
                    font-size: 24px;
                    margin: unset;
                    font-weight:bold;
                }

                img {
                    height: 40px;
                    float:unset;
                    margin: 0 20px 0 5px;
                }
                
            }
        }
        .progress-bar {
            li {
                span {
                    display:none;
                }
                flex-basis: 12%;
            }
        }
        .outer-container {
            padding-top: 0;
            .results-container {
                width: unset;
            }
            .conversation-container {
                &.mask {
                    -webkit-mask-image: -webkit-gradient(linear, left top, left 10%, from(rgba(0,0,0,0)), to(rgba(0,0,0,1)));
                }

                max-height:calc(100vh - 180px);

                padding: 40px 10px;
                margin: 20px auto;

                .ai-comment,
                .user-comment {
                    max-width: 80%;
                }
            }
        }
    }
}

.fade-enter-active, .fade-leave-active,
.delay-extra-fade-enter-active, .delay-extra-fade-leave-active,
.delay-fade-enter-active, .delay-fade-leave-active {
  transition: all 0.3s;
}

.fade-enter, .fade-leave-to,
.delay-fade-enter, .delay-fade-leave-to,
.delay-extra-fade-enter, .delay-extra-fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  height:0;
  transform: translateY(30px);
}

.delay-fade-enter-active, .delay-fade-leave-active {
  transition-delay: 0.7s;
  height:60px;
}
.delay-extra-fade-enter-active, .delay-extra-fade-leave-active {
  transition-delay: 1.7s;
}
</style>