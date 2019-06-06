export default {
    steps: [
        {
            question: false,
            display:true,
            text: "Hello! Over the next few minutes, we'll be asking you some questions to assess your cancer risk."
        },
        {
            question: false,
            display:true,
            text: `By participating in this quiz, you are agreeing to our <a href='#' target='_blank'>disclaimer statement</a>.`
        },
        {
            question: true,
            category: 'personal',
            text: "First of all, what is your age?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "18 - 24",
                    score: "24",
                    userResponse: "I am between 18 and 24 years old.",
                    aiResponse: "Okay!"
                },
                {
                    label: "25 - 39",
                    score: "39",
                    userResponse: "I am between 25 and 39 years old.",
                    aiResponse: "Okay!"
                },
                {
                    label: "40 - 49",
                    score: "49",
                    userResponse: "I am between 40 and 49 years old.",
                    aiResponse: "Okay!"
                },
                {
                    label: "50 - 64",
                    score: "64",
                    userResponse: "I am between 50 and 64 years old.",
                    aiResponse: "Okay!"
                },
                {
                    label: "65 - 74",
                    score: "74",
                    userResponse: "I am between 65 and 74 years old.",
                    aiResponse: "Okay!"
                },
                {
                    label: "75 +",
                    score: "75",
                    userResponse: "I am over 75 years old.",
                    aiResponse: "Okay!"
                },
            ]
        },
        {
            question: true,
            category: 'personal',
            text: "What is your gender?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Male",
                    score: "m",
                    userResponse: "I am male.",
                    aiResponse: "Okay!"
                },
                {
                    label: "Female",
                    score: "f",
                    userResponse: "I am female.",
                    aiResponse: "Okay!"
                }
            ]
        },
        {
            id: "postcode",
            question: true,
            display:true,
            category: 'personal',
            text: "What is your postcode?",
            userInput: true,
            score: null,
            userResponded: false,
            userResponse: '',
            aiResponded: false,
            aiResponse: 'Okay!'
        },
        {
            question:false,
            display:true,
            text: "Did you know the UV radiation from the sun causes more than 95% of all skin cancers? Every year, over 300 Queenslanders die from skin cancer, yet it is almost totally preventable. When UV levels are 3 and above use a combination of sun protection measures to reduce your risk of skin cancer."
        },
        {
            question: false,
            display:true,
            text: "When outside, how do you protect your skin?"
        },
        {
            id: 'clothing',
            question: true,
            category: 'uv',
            text: "Do you wear sun protective clothing (e.g. shirt with collar, sleeves and long pants)?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 30,
                    userResponse: "I wear sun protective clothing.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "I don't wear sun protective clothing outside.",
                    aiResponse: "Slip on sun protective clothing that covers as much skin as possible."
                }
            ]
        },
        {
            id: 'hat',
            question: true,
            category: 'uv',
            text: "Do you wear a sun protective hat (e.g. broad-brimmed or bucket style)?",
            score: null,
            display: true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 30,
                    userResponse: "Yes, I wear a sun protective hat outside.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "No, I don't wear a sun protective hat outside.",
                    aiResponse: "Slap on a broad-brimmed or bucket style hat that shades your face, neck and ears."
                }
            ]
        },
        {
            id: 'sunscreen',
            question: true,
            category:'uv',
            text: "Do you apply and reapply SPF30+ sunscreen or higher at least every 2 hours?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 30,
                    userResponse: "Yes, I apply and reapply SPF30+ sunscreen every 2 hours.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "No, I don't apply and reapply SPF30+ sunscreen every 2 hours.",
                    aiResponse: "Slop on SPF 30+ sunscreen to exposed parts of your body 20 minutes before going outdoors and reapply every 2 hours."
                }
            ]
        },
        {
            id: 'shade',
            question: true,
            category:'uv',
            text: "Do you stay in the shade where possible?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 30,
                    userResponse: "Yes, I stay in the shade where possible.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "No, I don't stay in the shade.",
                    aiResponse: "Seek shade whenever you can, especially when the UV radiation is highest – between 10am and 3pm."
                }
            ]
        },
        {
            id: 'sunglasses',
            question: true,
            category: 'uv',
            text: "Do you wear sunglasses?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 30,
                    userResponse: "Yes, I wear sunglasses.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "No, I don't wear sunglasses.",
                    aiResponse: "Slide on wrap-around, close-fitting sunglasses that meet Australian standards."
                }
            ]
        },
        {
            id: 'checkSkin',
            question: true,
            category: 'uv',
            text: "Do you regularly check your skin for new spots and changes to existing freckles or moles?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 30,
                    userResponse: "Yes, I regularly check my skin.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "No, I don't regularly check my skin.",
                    aiResponse: "Develop a regular habit of checking your skin, if you notice any new spots or changes to an existing spot such as size, shape or colour, see your doctor immediately."
                }
            ]
        },
        {
            id: 'professionalCheckSkin',
            question: true,
            category: 'uv',
            text: "Do you have your skin checked by a health professional, or speak to them about your skin cancer risk?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 30,
                    userResponse: "Yes, I have my skin checked by a health professional.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "No, I don't have my skin checked by a health professional.",
                    aiResponse: "Speak to your health professional about your skin cancer risk."
                }
            ]
        },
        {
            question: false,
            display:true,
            text: "The best thing you can do for your health is to quit smoking. More than 18,000 Australians die from smoking-related diseases each year."
        },
        {
            id: 'smokingStatus',
            question: true,
            category: 'smoking',
            text: "What is your smoking status?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "I have never smoked",
                    score: 105,
                    userResponse: "I have never smoked.",
                    aiResponse: "Well done!"
                },
                {
                    label: "I used to smoke, but no longer do.",
                    score: 104.9,
                    userResponse: "I used to smoke, but no longer do.",
                    aiResponse: "Well done!"
                },
                {
                    label: "I smoke occasionally",
                    score: 53,
                    userResponse: "I smoke occasionally.",
                    aiResponse: `It is never too late to quit smoking. Get support by visiting <a href='https://quithq.initiatives.qld.gov.au/' target='_blank'>QUIT HQ</a> or contact Quitline on 13 7848 and speak to a trained counsellor.`
                },
                {
                    label: "I smoke everyday",
                    score: 0,
                    userResponse: "I smoke everyday.",
                    aiResponse: `It is never too late to quit smoking. Get support by visiting <a href='https://quithq.initiatives.qld.gov.au/' target='_blank'>QUIT HQ</a> or contact Quitline on 13 7848 and speak to a trained counsellor.`
                }
            ]
        },
        {
            id: 'householdSmoke',
            question: true,
            category: 'smoking',
            text: "Is your household smoke-free?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 105,
                    userResponse: "Yes, my household is smoke-free.",
                    aiResponse: "Great!"
                },
                {
                    label: "No.",
                    score: 0,
                    userResponse: "No, my household is not smoke-free.",
                    aiResponse: "Okay."
                }
            ]
        },
        {
            id: 'standardDrinks',
            question: true,
            category: 'alcohol',
            text: `How many standard drinks do you typically consume in a day when you drink?<br><br>Examples of 1 standard drink:<br><ul class='examples'><li><span class="img-container"><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/bottle.png'/></span> 1 x 375mL bottle of mid strength beer</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/wine.png'/></span> 100 mL of wine (1 x small glass of wine)</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/glass2.png'/></span> 30 mL of spirits (1 x measure of spirits)</li></ul>`,
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "None",
                    score: 210,
                    userResponse: "I don't drink.",
                    aiResponse: "Well done!"
                },
                {
                    label: "1 - 2",
                    score: 209.9,
                    userResponse: "I'll typically consume 1 - 2 standard drinks.",
                    aiResponse: "Okay."
                },
                {
                    label: "2",
                    score: 105,
                    userResponse: "I'll typically consume around 2 standard drinks.",
                    aiResponse: "A little too much! Try to limit your alcohol consumption to no more than 2 standard drinks per day."
                },
                {
                    label: "More than 2",
                    score: 0,
                    userResponse: "I'll typically consume more than 2 standard drinks.",
                    aiResponse: "Try to limit your alcohol consumption to no more than 2 standard drinks per day."
                }
                
            ]
        },
        {
            id: 'fruit',
            question: true,
            category: 'nutrition',
            text: `How many serves of fruit do you eat in a typical day?<br><br>Examples of 1 serve of fruit:<br><ul class='examples'><li><span class="img-container"><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/apple.png'/></span>1 x apple</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/apricots.png'/></span> 2 x apricots</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/fruit.png'/></span>1 cup of fruit</li></ul>`,
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "None",
                    score: 0,
                    userResponse: "I don't eat any fruit in a typical day.",
                    aiResponse: "Try to eat at least 2 serves of fruit every day."
                },
                {
                    label: "1 serve",
                    score: 21,
                    userResponse: "I eat 1 serve of fruit in a typical day.",
                    aiResponse: "Good start! But you should try to eat at least 2 serves of fruit every day."
                },
                {
                    label: "2 or more",
                    score: 42,
                    userResponse: "I eat 2 or more serves of fruit in a typical day ",
                    aiResponse: "Well done!"
                }
                
            ]
        },
        {
            id: 'vegetables',
            question: true,
            category: 'nutrition',
            text: `How many serves of vegetables do you eat in a typical day?<br><br>Examples of 1 serve of vegetables:<br><ul class='examples'><li><span class="img-container"><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/vegetables.png'/></span>1/2 cup cooked vegetables</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/potato.png'/></span>1/2 medium potato</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/salad.png'/></span>1 cup of salad</li></ul>`,
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "None",
                    score: 0,
                    userResponse: "I don't eat any vegetables in a typical day.",
                    aiResponse: "Try to eat at least 5 serves of vegetables every day."
                },
                {
                    label: "1 - 2",
                    score: 14,
                    userResponse: "I eat 1 -2 serves of vegetables in a typical day.",
                    aiResponse: "Good start! But you should try to eat at least 5 serves of vegetables every day."
                },
                {
                    label: "3 - 4",
                    score: 28,
                    userResponse: "I eat 3 - 4 serves of vegetables in a typical day ",
                    aiResponse: "Good start! But you should try to eat at least 5 serves of vegetables every day."
                },
                {
                    label: "5 or more",
                    score: 42,
                    userResponse: "I eat 5 or more serves of vegetables in a typical day ",
                    aiResponse: "Well done!"
                }
                
            ]
        },
        {
            id: 'redMeat',
            question: true,
            category: 'nutrition',
            text: `How many serves of red meat do you eat in a typical week?<br><br>Examples of 1 serve:<br><ul class='examples'><li><span class="img-container"><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/lamb.png'/></span>1 lamb loin chop</li></ul><br>Examples of 2 serves:<ul class='examples'><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/steak.png'/></span>1 porterhouse/scotch fillet steak</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/diced-meat.png'/></span>1 cup diced meat</li></ul>`,
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "None",
                    score: 42,
                    userResponse: "I don't eat any red meat.",
                    aiResponse: "Well done!"
                },
                {
                    label: "1 - 4",
                    score: 41.9,
                    userResponse: "I eat 1 - 4 serves of red meat in a typical week.",
                    aiResponse: "Well done!"
                },
                {
                    label: "5 - 7",
                    score: 41.8,
                    userResponse: "I eat 5 - 7 serves of red meat in a typical week ",
                    aiResponse: "Well done!"
                },
                {
                    label: "8 or more",
                    score: 0,
                    userResponse: "I eat 8 or more serves of red meat in a typical week ",
                    aiResponse: "Try to limit your red meat consumption to no more than 7 serves (455g) per week."
                }
                
            ]
        },
        {
            id: 'processedMeat',
            question: true,
            category: 'nutrition',
            text: `How many serves of processed meat do you eat in a typical week?<br><br>Example of 1 serve:<br><ul class='examples'><li><span class="img-container"><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/bacon.png'/></span>2 slices of bacon</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/salami.png'/></span>2 slices of salami or ham</li><li><span class='img-container'><img src='https://cancerqld.blob.core.windows.net/content/code/global/img/questquiz/sausages.png'/></span>2 thin sausages</li></ul>`,
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "None",
                    score: 42,
                    userResponse: "I don't eat any processed meat.",
                    aiResponse: "Well done!"
                },
                {
                    label: "Less than 1",
                    score: 41.9,
                    userResponse: "I eat less than 1 serve of processed meat in a typical week.",
                    aiResponse: "Well done!"
                },
                {
                    label: "1 - 2",
                    score: 21,
                    userResponse: "I eat 1 - 2 serves of procssed meat in a typical week ",
                    aiResponse: "A little too much! Try to avoid processed meat consumption or cut down the amount you currently consume."
                },
                {
                    label: "3 or more",
                    score: 0,
                    userResponse: "I eat 3 or more serves of processed meat in a typical week ",
                    aiResponse: "Try to avoid processed meat consumption or cut down the amount you currently consume."
                }
                
            ]
        },
        {
            id: 'wholegrain',
            question: true,
            category: 'nutrition',
            text: `How often do you choose wholegrain, wholemeal and/or high fibre food varieties? (e.g. brown rice, wholemeal bread)`,
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Never",
                    score: 0,
                    userResponse: "I never choose wholegrain, wholemeal and/or high fibre food varieties.",
                    aiResponse: "Try to choose wholegrain and wholemeal varieties for at lest half your daily serves of breads and cereals."
                },
                {
                    label: "Some of the time",
                    score: 21,
                    userResponse: "I sometimes choose wholegrain, wholemeal and/or high fibre food varieties.",
                    aiResponse: "Good start! But you should try to choose wholegrain and wholemeal varieties for at least half your daily serves of breads and cereals."
                },
                {
                    label: "Most of the time",
                    score: 41.9,
                    userResponse: "I mostly choose wholegrain, wholemeal and/or high fibre food varieties.",
                    aiResponse: "Well done!"
                },
                {
                    label: "Always",
                    score: 42,
                    userResponse: "I always choose wholegrain, wholemeal and/or high fibre food varieties.",
                    aiResponse: "Well done!"
                }
                
            ]
        },
        {
            id:"weight",
            question: true,
            category: 'weight',
            text: "Being overweight or obese increases the risk of some types of cancer, including bowel, breast and oesophagus.",
            score: null,
            display: true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Calculate my BMI",
                    score: 'bmi',
                    userResponse: "Let's calculate my BMI.",
                    aiResponse: "Okay!"
                },
                {
                    label: "Use my waist measurement",
                    score: 'waist',
                    userResponse: "Let's use my waist measurement.",
                    aiResponse: "Okay!"
                },
                {
                    label: "Skip question",
                    score: 'skip',
                    userResponse: "I would like to skip this question.",
                    aiResponse: "Okay."
                },
            ]
        },
        {
            id: "bmi",
            question: true,
            category: 'weight',
            text: "Please enter your height (cm) and weight (kg):",
            userInput: true,
            score: null,
            display: 'this.steps[23].score === "bmi"',
            userResponded: false,
            userResponse: '',
            aiResponded: false,
            aiResponse: '',
            height: null,
            weight: null,
            bmi:null
        },
        {
            id: "waist",
            question: true,
            category: 'weight',
            text: "Please enter your waist measurement:",
            userInput: true,
            score: null,
            display: 'this.steps[23].score === "waist"',
            userResponded: false,
            userResponse: '',
            aiResponded: false,
            aiResponse: '',
            waist: null
        },
        {
            id: 'exercise',
            question: true,
            category: 'physical activity',
            text: `In a typical week, how many days are you physically active for 30 minutes or more?`,
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "None",
                    score: 0,
                    userResponse: "I am not physically active for 30 or more minutes in a typical week.",
                    aiResponse: "To reduce your cancer risk, aim for 1 hour of moderate intensity or 30 minutes of vigorous intensity physical activity every day."
                },
                {
                    label: "1 - 2",
                    score: 14,
                    userResponse: "I am physically active for 30 minutes or more for 1 - 2 days in a typical week.",
                    aiResponse: "You're on the right track! To reduce your cancer risk, aim for 1 hour of moderate intensity or 30 minutes of vigorous intensity physical activity every day."
                },
                {
                    label: "3 - 4",
                    score: 28,
                    userResponse: "I am physically active for 30 minutes or more for 3 - 4 days in a typical week.",
                    aiResponse: "You're on the right track! To reduce your cancer risk, aim for 1 hour of moderate intensity or 30 minutes of vigorous intensity physical activity every day."
                },
                {
                    label: "5 - 7",
                    score: 42,
                    userResponse: "I am physically active for 30 minutes or more for 5 - 7 days in a typical week.",
                    aiResponse: "Well done!"
                }
                
            ]
        },
        {
            id: 'breastScreening',
            question: true,
            category: 'screening',
            text: "Do you participate in the national breast cancer screening program?",
            score: null,
            display: '["59", "74"].includes(this.steps[2].score) && this.steps[3].score === "f"',
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 70,
                    userResponse: "I participate in the national breast cancer screening program.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "No, I don't participate in the national breast cancer screening program.",
                    aiResponse: `Participating in the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/breast-screening-1' target='_blank'>National Breast Cancer Screening Program</a> greatly increases the likelihood of early detection of breast cancer and successful treatment.`
                },
                {
                    label: "No - I screen for breast cancer outside of the national breast cancer screening program (e.g. ultrasound or mammogram).",
                    score: 69.9,
                    userResponse: "No, but I screen for breast cancer outside of this program.",
                    aiResponse: "Well done!"
                },
            ]
        },
        {
            id: 'bowelScreening',
            question: true,
            category: 'screening',
            text: "Do you participate in the national bowel cancer screening program?",
            score: null,
            display: '["59", "74"].includes(this.steps[2].score)',
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 70,
                    userResponse: "I participate in the national bowel cancer screening program.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "No, I don't participate in the national bowel cancer screening program.",
                    aiResponse: `Participating in the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/bowel-screening-1' target='_blank'>National Bowel Cancer Screening Program</a> greatly increases the likelihood of early detection of bowel cancer and successful treatment.`
                },
                {
                    label: "No - I screen for bowel cancer outside of the national bowel cancer screening program (e.g. colonoscopy).",
                    score: 69.9,
                    userResponse: "No, but I screen for bowel cancer outside of this program.",
                    aiResponse: "Well done!"
                },
            ]
        },
        {
            id: 'cervicalScreening',
            question: true,
            category: 'screening',
            text: "Do you participate in cervical screening?",
            score: null,
            display: '["39", "49", "64", "74"].includes(this.steps[2].score) && this.steps[3].score === "f"',
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 70,
                    userResponse: "I participate in cervical screening.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "No, I don't participate in cervical screening.",
                    aiResponse: "Participating in the <a href='http://www.cancerscreening.gov.au/internet/screening/publishing.nsf/Content/cervical-screening-1' target='_blank'>National Cervical Screening Program</a> offers the best protection against cervical cancer."
                }
            ]
        },
        {
            question:false,
            display:true,
            text: "Okay! Let's calculate your results...",
            final:true
        }
    ]

}