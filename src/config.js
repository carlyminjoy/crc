export default {
    steps: [
        {
            question: true,
            category: 'personal',
            text: "What is your age?",
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
                    userResponse: "I am female",
                    aiResponse: "Okay!"
                }
            ]
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
                    score: 4,
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
                    score: 4,
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
                    score: 4,
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
                    score: 4,
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
                    score: 4,
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
            question: false,
            display:true,
            text: "The best thing you can do for your health is to quit smoking. More than 18,000 Australians die from smoking-related diseases each year."
        },
        {
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
                    score: 10,
                    userResponse: "I have never smoked.",
                    aiResponse: "Well done!"
                },
                {
                    label: "I used to smoke, but no longer do.",
                    score: 9.9,
                    userResponse: "I used to smoke, but no longer do.",
                    aiResponse: "Well done!"
                },
                {
                    label: "I smoke occasionally.",
                    score: 5,
                    userResponse: "I smoke occasionally.",
                    aiResponse: `It is never too late to quit smoking. Get support by visiting <a href='https://quithq.initiatives.qld.gov.au/" target="_blank">QUIT HQ</a> or contact Quitline on 13 7848 and speak to a trained counsellor.`
                },
                {
                    label: "I smoke everyday.",
                    score: 0,
                    userResponse: "I somke everyday.",
                    aiResponse: `It is never too late to quit smoking. Get support by visiting <a href='https://quithq.initiatives.qld.gov.au/" target="_blank">QUIT HQ</a> or contact Quitline on 13 7848 and speak to a trained counsellor.`
                }
            ]
        },
        {
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
                    score: 10,
                    userResponse: "Yes, my household is smoke-free.",
                    aiResponse: "Well done!"
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
            question: true,
            category: 'alcohol',
            text: "How many standard drinks do you typically consume in a day when you drink?",
            score: null,
            display:true,
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "None",
                    score: 10,
                    userResponse: "I don't drink.",
                    aiResponse: "Well done!"
                },
                {
                    label: "1 - 2",
                    score: 9.9,
                    userResponse: "I'll typically consume 1 - 2 standard drinks.",
                    aiResponse: "Okay."
                },
                {
                    label: "2",
                    score: 5,
                    userResponse: "I'll typically consume around 2 standard drinks.'",
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
            question: true,
            category: 'screening',
            text: "Do you participate in the national breast cancer screening program?",
            score: null,
            display: '["59", "74"].includes(this.steps[0].score) && this.steps[1].score === "f"',
            userResponded: false,
            aiResponded: false,
            options: [
                {
                    label: "Yes",
                    score: 10,
                    userResponse: "I don't drink.",
                    aiResponse: "Well done!"
                },
                {
                    label: "No",
                    score: 0,
                    userResponse: "No, I don't participate in this program.",
                    aiResponse: "Participating in the National Breast Cancer Screening Program greatly increases the likelihood of early detection of breast cancer and successful treatment."
                },
                {
                    label: "No - I screen for breast cancer outside of this program (e.g. ultrasound or mammogram).",
                    score: 10,
                    userResponse: "No, but I screen for breast cancer outside of this program.",
                    aiResponse: "Well done!"
                },
            ]
        },
    ]

}