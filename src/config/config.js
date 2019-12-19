export default {
    steps: [{
            question: false,
            display: () => true,
            text: "Hello! Over the next few minutes, we’ll be asking you some questions to recommend ways you can reduce your cancer risk."
        },
        {
            question: false,
            display: () => true,
            text: `<em>The results of this quiz provide generalised recommendations on how you can reduce your cancer risk based on the answers you provide.<br><br> These should not be used as a substitute for advice from a qualified medical professional who can advise you about your own individual medical needs.<br><br>See our <a href='#' target='_blank'>disclaimer</a>.</em>`
        },
        {
            id: 'age',
            question: true,
            category: 'personal',
            text: "First of all, what is your age?",
            score: null,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "18 - 24",
                    score: "24",
                    userResponse: "I am between 18 and 24 years old."
                },
                {
                    label: "25 - 39",
                    score: "39",
                    userResponse: "I am between 25 and 39 years old."
                },
                {
                    label: "40 - 49",
                    score: "49",
                    userResponse: "I am between 40 and 49 years old."
                },
                {
                    label: "50 - 64",
                    score: "64",
                    userResponse: "I am between 50 and 64 years old."
                },
                {
                    label: "65 - 74",
                    score: "74",
                    userResponse: "I am between 65 and 74 years old."
                },
                {
                    label: "75 +",
                    score: "75",
                    userResponse: "I am over 75 years old."
                },
            ]
        },
        {
            id: 'gender',
            question: true,
            category: 'personal',
            text: "What is your gender?",
            score: null,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "Male",
                    score: "m",
                    userResponse: "I am male."
                },
                {
                    label: "Female",
                    score: "f",
                    userResponse: "I am female."
                },
                {
                    label: "Other",
                    score: "o",
                    userResponse: "Other."
                }
            ]
        },
        {
            id: 'identify',
            question: true,
            category: 'personal',
            text: "Do you identify as Aboriginal or Torres Strait Islander, or speak English as a second language? ",
            score: null,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "No",
                    score: "no",
                    userResponse: "No."
                },
                {
                    label: "Aboriginal or Torres Strait Islander ",
                    score: "Aboriginal or Torres Strait Islander ",
                    userResponse: "I identify as Aboriginal or Torres Strait Islander."
                },
                {
                    label: "English as a second language",
                    score: "English as a second language",
                    userResponse: "I speak English as a second language."
                }
            ]
        },
        {
            id: "postcode",
            question: true,
            display: () => true,
            category: 'personal',
            text: "What is your postcode?",
            userInput: true,
            score: null,
            userResponded: false,
            userResponse: ''
        },
        {
            question: false,
            display: () => true,
            text: "Okay, thanks for providing your details. Let's begin!",
            delay: true
        },
        {
            question: false,
            display: () => true,
            text: "First up, let's talk about ultraviolet (UV) radiation from the sun."
        },
        {
            question: false,
            display: () => true,
            text: `<span class='big'>When outside for extended periods of time, how do you protect your skin?</span>`
        },
        {
            id: 'clothing',
            question: true,
            category: 'uv',
            text: `Do you wear sun protective clothing (e.g. shirt with a collar, sleeves and long pants?`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "I wear sun protective clothing.",
                    recommendation: "Well done! It's important to slip on sun protective clothing that covers as much skin as possible."
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't wear sun protective clothing outside.",
                    recommendation: "Slip on sun protective clothing that covers as much skin as possible."
                }
            ]
        },
        {
            id: 'hat',
            question: true,
            category: 'uv',
            text: "Do you wear a sun protective hat (e.g. broad-brimmed or bucket style)?",
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "I wear a sun protective hat outside.",
                    recommendation: "Well done! Always slap on a broad-brimmed or bucket style hat that shades your face, neck and ears."
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't wear a sun protective hat outside.",
                    recommendation: "Slap on a broad-brimmed or bucket style hat that shades your face, neck and ears."
                }
            ]
        },
        {
            id: 'sunscreen',
            question: true,
            category: 'uv',
            text: "Do you apply and reapply SPF30+ sunscreen or higher at least every 2 hours?",
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "I apply and reapply SPF30+ sunscreen every 2 hours.",
                    recommendation: "Well done! Slop on SPF 30+ sunscreen to exposed parts of your body 20 minutes before going outdoors and reapply every 2 hours."
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't apply and reapply SPF30+ sunscreen every 2 hours.",
                    recommendation: "Slop on SPF 30+ sunscreen to exposed parts of your body 20 minutes before going outdoors and reapply every 2 hours."
                }
            ]
        },
        {
            id: 'shade',
            question: true,
            category: 'uv',
            text: "Do you stay in the shade where possible?",
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "I stay in the shade where possible.",
                    recommendation: "Well done! Always seek shade whenever you can, especially when the UV radiation is highest - between 10am and 3pm."
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't stay in the shade.",
                    recommendation: "Seek shade whenever you can, especially when the UV radiation is highest – between 10am and 3pm."
                }
            ]
        },
        {
            id: 'sunglasses',
            question: true,
            category: 'uv',
            text: "Do you wear sunglasses?",
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "I wear sunglasses.",
                    recommendation: "Well done! Slide on wrap-around, close-fitting sunglasses that meet Australian standards."
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't wear sunglasses.",
                    recommendation: "Slide on wrap-around, close-fitting sunglasses that meet Australian standards."
                }
            ]
        },
        {
            question: false,
            display: () => true,
            text: "Okay, next question!"
        },
        {
            id: 'checkSkin',
            question: true,
            category: 'uv',
            text: `<span class='big'>Do you regularly check your skin for new spots and changes to existing freckles or moles?</span>`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "I regularly check my skin.",
                    recommendation: "Well done! It's important to develop a regular habit of checking your skin. If you notice any new spots or changes to an existing spot such as size, shape or colour, see your doctor immediately."
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't regularly check my skin.",
                    recommendation: "Develop a regular habit of checking your skin, if you notice any new spots or changes to an existing spot such as size, shape or colour, see your doctor immediately."
                }
            ]
        },
        {
            id: 'professionalCheckSkin',
            question: true,
            category: 'uv',
            text: `<span class='big'>Do you have your skin checked by a health professional, or speak to them about your skin cancer risk?</span>`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "I have my skin checked by a health professional.",
                    recommendation: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't have my skin checked by a health professional.",
                    recommendation: "Speak to your health professional about your skin cancer risk."
                }
            ]
        },
        {
            question: false,
            display: () => true,
            text: "Okay! Thanks for answering those questions. Let's move on!",
            delay: true
        },
        {
            question: false,
            display: () => true,
            text: "Next category: smoking habits."
        },
        {
            id: 'smokingStatus',
            question: true,
            category: 'smoking',
            text: `<span class='big'>What is your smoking status?</span>`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "I have never smoked",
                    score: 100,
                    userResponse: "I have never smoked.",
                    recommendation: "Well done!"
                },
                {
                    label: "I used to smoke, but no longer do.",
                    score: 99.9,
                    userResponse: "I used to smoke, but no longer do.",
                    recommendation: "Well done!"
                },
                {
                    label: "I smoke occasionally",
                    score: 0.1,
                    userResponse: "I smoke occasionally.",
                    recommendation: `It is never too late to quit smoking. Get support by visiting <a href='https://quithq.initiatives.qld.gov.au/' target='_blank'>QUIT HQ</a> or contact Quitline on 13 7848 and speak to a trained counsellor.`
                },
                {
                    label: "I smoke everyday",
                    score: 0,
                    userResponse: "I smoke everyday.",
                    recommendation: `It is never too late to quit smoking. Get support by visiting <a href='https://quithq.initiatives.qld.gov.au/' target='_blank'>QUIT HQ</a> or contact Quitline on 13 7848 and speak to a trained counsellor.`
                }
            ]
        },
        {
            id: 'householdSmoke',
            question: true,
            category: 'smoking',
            text: `<span class='big'>Is your household smoke-free?</span>`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "My household is smoke-free.",
                    recommendation: "Great!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "My household is not smoke-free.",
                    recommendation: "If you have a friend or family member who smokes, encourage them to make a quit attempt and assist them on their journey."
                }
            ]
        },
        {
            question: false,
            display: () => true,
            text: "Okay! Let's move on to alcohol consumption.",
            delay: true
        },
        {
            id: 'standardDrinks',
            question: true,
            category: 'alcohol',
            text: `<span class='big'>How many standard drinks do you typically consume in a day when you drink? </span><br><br>Examples of 1 standard drink:<br><ul class='examples'><li><span class="img-container"><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/bottle.png'/></span> 1 x 375mL bottle of mid strength beer</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/wine.png'/></span> 100 mL of wine (1 x small glass of wine)</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/glass2.png'/></span> 30 mL of spirits (1 x measure of spirits)</li></ul>`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "None",
                    score: 100,
                    userResponse: "I don't drink.",
                    recommendation: "Well done!"
                },
                {
                    label: "1 - 2",
                    score: 99.9,
                    userResponse: "When I drink, I'll typically consume 1 - 2 standard drinks in a day.",
                    recommendation: "Great - always try to limit your alcohol consumption to no more than 2 standard drinks per day."
                },
                {
                    label: "More than 2",
                    score: 0,
                    userResponse: "When I drink, I'll typically consume more than 2 standard drinks in a day.",
                    recommendation: "Try to limit your alcohol consumption to no more than 2 standard drinks per day."
                }

            ]
        },
        {
            question: false,
            display: () => true,
            text: "Okay!",
            delay: true
        },
        {
            question: false,
            display: () => true,
            text: "Let's discuss nutrition."
        },
        {
            id: 'fruit',
            question: true,
            category: 'nutrition',
            text: `<span class='big'>How many serves of fruit do you eat in a typical day?</span><br><br>Examples of 1 serve of fruit:<br><ul class='examples'><li><span class="img-container"><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/apple.png'/></span>1 x apple</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/apricots.png'/></span> 2 x apricots</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/fruit.png'/></span>1 cup of fruit</li></ul>`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "None",
                    score: 0,
                    userResponse: "I don't eat any fruit in a typical day.",
                    recommendation: "Try to eat at least 2 serves of fruit every day."
                },
                {
                    label: "1 serve",
                    score: 50,
                    userResponse: "I eat 1 serve of fruit in a typical day.",
                    recommendation: "Good start! But you should try to eat at least 2 serves of fruit every day."
                },
                {
                    label: "2 or more",
                    score: 100,
                    userResponse: "I eat 2 or more serves of fruit in a typical day.",
                    recommendation: "Well done! You should try to eat at least 2 serves of fruit every day."
                }

            ]
        },
        {
            id: 'vegetables',
            question: true,
            category: 'nutrition',
            text: `<span class='big'>How many serves of vegetables do you eat in a typical day?</span><br><br>Examples of 1 serve of vegetables:<br><ul class='examples'><li><span class="img-container"><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/vegetables.png'/></span>1/2 cup cooked vegetables</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/potato.png'/></span>1/2 medium potato</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/salad.png'/></span>1 cup of salad</li></ul>`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "None",
                    score: 0,
                    userResponse: "I don't eat any vegetables in a typical day.",
                    recommendation: "Try to eat at least 5 serves of vegetables every day."
                },
                {
                    label: "1 - 2",
                    score: 33,
                    userResponse: "I eat 1 -2 serves of vegetables in a typical day.",
                    recommendation: "Good start! But you should try to eat at least 5 serves of vegetables every day."
                },
                {
                    label: "3 - 4",
                    score: 66,
                    userResponse: "I eat 3 - 4 serves of vegetables in a typical day.",
                    recommendation: "Good start! But you should try to eat at least 5 serves of vegetables every day."
                },
                {
                    label: "5 or more",
                    score: 100,
                    userResponse: "I eat 5 or more serves of vegetables in a typical day.",
                    recommendation: "Well done! You should try to eat at least 5 or more serves of vegetables each day."
                }

            ]
        },
        {
            id: 'redMeat',
            question: true,
            category: 'nutrition',
            text: `<span class='big'>How many serves of red meat do you eat in a typical week?</span><br><br>1 serve is 65g of cooked lean red meat, such as beef, lamb, veal and pork.<br><br>Examples of 1 serve:<br><ul class='examples'><li><span class="img-container"><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/lamb.png'/></span>1 lamb loin chop</li></ul><br>Examples of 2 serves:<ul class='examples'><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/steak.png'/></span>1 porterhouse/scotch fillet steak</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/diced-meat.png'/></span>1 cup diced meat</li></ul>`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "None",
                    score: 100,
                    userResponse: "I don't eat any red meat.",
                    recommendation: "Well done! Red meat consumption should be limited to no more than 7 serves (455g) per week."
                },
                {
                    label: "1 - 4",
                    score: 99.9,
                    userResponse: "I eat 1 - 4 serves of red meat in a typical week.",
                    recommendation: "Well done! Red meat consumption should be limited to no more than 7 serves (455g) per week."
                },
                {
                    label: "5 - 7",
                    score: 99.8,
                    userResponse: "I eat 5 - 7 serves of red meat in a typical week.",
                    recommendation: "Well done! Red meat consumption should be limited to no more than 7 serves (455g) per week."
                },
                {
                    label: "8 or more",
                    score: 0,
                    userResponse: "I eat 8 or more serves of red meat in a typical week.",
                    recommendation: "Try to limit your red meat consumption to no more than 7 serves (455g) per week."
                }

            ]
        },
        {
            id: 'processedMeat',
            question: true,
            category: 'nutrition',
            text: `<span class='big'>How many serves of processed meat do you eat in a typical week?</span><br><br>Example of 1 serve:<br><ul class='examples'><li><span class="img-container"><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/bacon.png'/></span>2 slices of bacon</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/salami.png'/></span>2 slices of salami or ham</li></ul>`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "None",
                    score: 100,
                    userResponse: "I don't eat any processed meat.",
                    recommendation: "Well done!"
                },
                {
                    label: "Less than 1",
                    score: 99.9,
                    userResponse: "I eat less than 1 serve of processed meat in a typical week.",
                    recommendation: "Well done!"
                },
                {
                    label: "1 - 2",
                    score: 50,
                    userResponse: "I eat 1 - 2 serves of processed meat in a typical week.",
                    recommendation: "A little too much! Try to avoid processed meat or cut down the amount you currently consume."
                },
                {
                    label: "3 or more",
                    score: 0,
                    userResponse: "I eat 3 or more serves of processed meat in a typical week.",
                    recommendation: "Try to avoid processed meat or cut down the amount you currently consume."
                }

            ]
        },
        {
            id: 'fibre',
            question: true,
            category: 'nutrition',
            text: `<span class='big'>How often do you choose wholegrain, wholemeal and/or high fibre food varieties? </span><br>(e.g. brown rice, wholemeal bread)`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "Never",
                    score: 0,
                    userResponse: "I never choose wholegrain, wholemeal and/or high fibre food varieties.",
                    recommendation: "Try to choose wholegrain and wholemeal varieties for at least half your daily serves of breads and cereals."
                },
                {
                    label: "Some of the time",
                    score: 50,
                    userResponse: "I sometimes choose wholegrain, wholemeal and/or high fibre food varieties.",
                    recommendation: "Good start! But you should try to choose wholegrain and wholemeal varieties for at least half your daily serves of breads and cereals."
                },
                {
                    label: "Most of the time",
                    score: 99.9,
                    userResponse: "I mostly choose wholegrain, wholemeal and/or high fibre food varieties.",
                    recommendation: "Well done!"
                },
                {
                    label: "Always",
                    score: 100,
                    userResponse: "I always choose wholegrain, wholemeal and/or high fibre food varieties.",
                    recommendation: "Well done!"
                }

            ]
        },
        {
            question: false,
            display: () => true,
            text: "Okay! That's it for nutrition.",
            delay: true
        },
        {
            question: false,
            display: () => true,
            text: "Next, let's talk about weight."
        },
        {
            id: "weight",
            question: true,
            category: 'weight',
            text: `<span class='big'>Please share your weight status with us by using the BMI calculator or your waist measurement.</span>`,
            score: null,
            display: (steps) => steps.find(s => s.id === 'gender').score !== 'o',
            userResponded: false,
            options: [{
                    label: "Calculate my BMI",
                    score: 'bmi',
                    userResponse: "Let's calculate my BMI."
                },
                {
                    label: "Use my waist measurement",
                    score: 'waist',
                    userResponse: "Let's use my waist measurement."
                },
                {
                    label: "Skip question",
                    score: 'skip',
                    userResponse: "I would like to skip this question."
                },
            ]
        },
        {
            id: "weightOther",
            question: true,
            category: 'weight',
            text: `<span class='big'>Please share your weight status with us by using the BMI calculator.</span>`,
            score: null,
            display: (steps) => steps.find(s => s.id === 'gender').score === 'o',
            userResponded: false,
            options: [{
                    label: "Calculate my BMI",
                    score: 'bmi',
                    userResponse: "Let's calculate my BMI."
                },
                {
                    label: "Skip question",
                    score: 'skip',
                    userResponse: "I would like to skip this question."
                },
            ]
        },
        {
            id: "bmi",
            question: true,
            category: 'weight',
            text: `<span class='big'>Please enter your height (cm) and weight (kg):</span>`,
            userInput: true,
            score: null,
            scoredQuestion: true,
            display: (steps) => {
                let gender = steps.find(s => s.id === 'gender').score;
                let weightOption = steps.find(s => s.id === (gender === 'o' ? 'weightOther' : 'weight')).score
                return weightOption === 'bmi'
            },
            userResponded: false,
            userResponse: '',
            recommendation: '',
            height: null,
            weight: null,
            bmi: null
        },
        {
            id: "waist",
            question: true,
            category: 'weight',
            text: "<span class='big'>Please enter your waist measurement:</span>",
            userInput: true,
            score: null,
            scoredQuestion: true,
            display: (steps) => {
                let gender = steps.find(s => s.id === 'gender').score;
                let weightOption = steps.find(s => s.id === (gender === 'o' ? 'weightOther' : 'weight')).score

                return weightOption === 'waist'
            },
            userResponded: false,
            userResponse: '',
            recommendation: '',
            waist: null
        },
        {
            question: false,
            display: () => true,
            text: "Okay! We're almost done!",
            delay: true
        },
        {
            question: false,
            display: () => true,
            text: "Let's talk about physical activity."
        },
        {
            id: 'exercise',
            question: true,
            category: 'physical activity',
            text: `<span class='big'>In a typical week, how many days are you physically active for 30 minutes or more?</span>`,
            score: null,
            scoredQuestion: true,
            display: () => true,
            userResponded: false,
            options: [{
                    label: "None",
                    score: 0,
                    userResponse: "I am not physically active for 30 or more minutes in a typical week.",
                    recommendation: "To reduce your cancer risk, aim for 1 hour of moderate intensity or 30 minutes of vigorous intensity physical activity every day."
                },
                {
                    label: "1 - 2",
                    score: 33,
                    userResponse: "I am physically active for 30 minutes or more for 1 - 2 days in a typical week.",
                    recommendation: "You're on the right track! To reduce your cancer risk, aim for 1 hour of moderate intensity or 30 minutes of vigorous intensity physical activity every day."
                },
                {
                    label: "3 - 4",
                    score: 66,
                    userResponse: "I am physically active for 30 minutes or more for 3 - 4 days in a typical week.",
                    recommendation: "You're on the right track! To reduce your cancer risk, aim for 1 hour of moderate intensity or 30 minutes of vigorous intensity physical activity every day."
                },
                {
                    label: "5 - 7",
                    score: 100,
                    userResponse: "I am physically active for 30 minutes or more for 5 - 7 days in a typical week.",
                    recommendation: "Well done! 1 hour of moderate intensity or 30 minutes of vigorous intensity physical activity every day is recommended to reduce your cancer risk."
                }

            ]
        },
        {
            question: false,
            display: (steps) => {
                let age = steps.find(s => s.id === 'age').score;
                let gender = steps.find(s => s.id === 'gender').score;

                return (age && gender) &&
                    ((["64", "74"].includes(age)) ||
                        (["39", "49"].includes(age) && gender === "f"))
            },
            text: "Thanks! We're up to the final category - cancer screening.",
            delay: true
        },
        {
            id: 'breastScreening',
            question: true,
            category: 'screening',
            text: `<span class='big'>Do you participate in the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/breast-screening-1' target='_blank'></i>National Breast Cancer Screening Program</a>?</span>`,
            score: null,
            scoredQuestion: true,
            display: (steps) => {
                let age = steps.find(s => s.id === 'age').score
                let gender = steps.find(s => s.id === 'gender').score

                return ["64", "74"].includes(age) && gender === "f"
            },
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "I participate in the national breast cancer screening program.",
                    recommendation: "Well done! Participating in the program greatly increases the likelihood of early detection of breast cancer and successful treatment."
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't participate in the National Breast Cancer Screening Program.",
                    recommendation: `Participating in the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/breast-screening-1' target='_blank'>National Breast Cancer Screening Program</a> greatly increases the likelihood of early detection of breast cancer and successful treatment.`
                },
                {
                    label: "No - I screen for breast cancer outside of the National Breast Cancer Screening Program (e.g. ultrasound or mammogram).",
                    score: 99.9,
                    userResponse: "I screen for breast cancer outside of the National Breast Cancer Screening Program.",
                    recommendation: "Well done!"
                },
            ]
        },
        {
            id: 'bowelScreening',
            question: true,
            category: 'screening',
            text: `<span class='big'>Do you participate in the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/bowel-screening-1' target='_blank'>National Bowel Cancer Screening Program</a>?</span>`,
            score: null,
            scoredQuestion: true,
            display: (steps) => {
                let age = steps.find(s => s.id === 'age').score

                return ["64", "74"].includes(age)
            },
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "I participate in the National Bowel Cancer Screening Program.",
                    recommendation: "Well done! Participating in the program greatly increases the likelihood of early detection of bowel cancer and successful treatment."
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't participate in the National Bowel Cancer Screening Program.",
                    recommendation: `Participating in the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/bowel-screening-1' target='_blank'>National Bowel Cancer Screening Program</a> greatly increases the likelihood of early detection of bowel cancer and successful treatment.`
                },
                {
                    label: "No - I screen for bowel cancer outside of the National Bowel Cancer Screening Program (e.g. colonoscopy).",
                    score: 99.9,
                    userResponse: "I screen for bowel cancer outside of the National Bowel Cancer Screening Program.",
                    recommendation: "Well done!"
                },
            ]
        },
        {
            id: 'cervicalScreening',
            question: true,
            category: 'screening',
            text: `<span class='big'>Do you participate in the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/cervical-screening-1' target='_blank'>National Cervical Screening Program</a> (replaced the previous Pap test)?</span>`,
            score: null,
            scoredQuestion: true,
            display: (steps) => {
                let age = steps.find(s => s.id === 'age').score
                let gender = steps.find(s => s.id === 'gender').score

                return ["39", "49", "64", "74"].includes(age) && gender === "f"
            },
            userResponded: false,
            options: [{
                    label: "Yes",
                    score: 100,
                    userResponse: "I participate in cervical screening.",
                    recommendation: "Well done! Participating in the program offers the best protection against cervical cancer."
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't participate in cervical screening.",
                    recommendation: "Participating in the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/cervical-screening-1' target='_blank'>National Cervical Screening Program</a> offers the best protection against cervical cancer."
                }
            ]
        },
        {
            id: 'final',
            question: false,
            display: () => true,
            text: "Great! You've answered all the questions. Let's calculate your results..."
        }
    ]

}