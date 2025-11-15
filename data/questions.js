// Quiz questions about moon phases
const quizQuestions = [
    {
        id: 1,
        question: "달의 모양이 변하는 데 걸리는 시간은 약 며칠인가요?",
        options: [
            "약 7일",
            "약 15일",
            "약 30일",
            "약 60일"
        ],
        correctAnswer: 2,
        concept: "달의 주기",
        feedback: {
            correct: "정답이에요! 달은 약 29.5일(약 한 달) 주기로 모양이 변해요.",
            incorrect: "아쉬워요. 달은 약 29.5일(약 한 달) 주기로 모양이 변한답니다. 시뮬레이터를 다시 관찰해보세요!"
        }
    },
    {
        id: 2,
        question: "달이 완전히 둥근 모양일 때를 무엇이라고 하나요?",
        options: [
            "초승달",
            "보름달",
            "상현달",
            "그믐달"
        ],
        correctAnswer: 1,
        concept: "달의 명칭",
        feedback: {
            correct: "맞았어요! 달이 완전히 둥글게 보일 때를 보름달이라고 해요.",
            incorrect: "다시 생각해보세요. 달이 완전히 둥근 모양일 때는 보름달이에요."
        }
    },
    {
        id: 3,
        question: "초승달 다음에 나타나는 달의 모양은?",
        options: [
            "상현달",
            "보름달",
            "하현달",
            "그믐달"
        ],
        correctAnswer: 0,
        concept: "달의 순서",
        feedback: {
            correct: "잘했어요! 초승달 → 상현달 → 보름달 순서로 달이 점점 커져요.",
            incorrect: "초승달 이후에는 달이 점점 커지면서 상현달이 된답니다."
        }
    },
    {
        id: 4,
        question: "달이 오른쪽 반만 밝게 보이는 것은?",
        options: [
            "초승달",
            "상현달",
            "하현달",
            "그믐달"
        ],
        correctAnswer: 1,
        concept: "달의 모양",
        feedback: {
            correct: "정답입니다! 상현달은 오른쪽 반이 밝게 보여요.",
            incorrect: "오른쪽 반이 밝게 보이는 것은 상현달이에요. 시뮬레이터에서 7일째를 확인해보세요!"
        }
    },
    {
        id: 5,
        question: "보름달 다음에는 어떤 달이 나타나나요?",
        options: [
            "달이 점점 작아진다",
            "달이 점점 커진다",
            "달의 크기가 변하지 않는다",
            "달이 사라진다"
        ],
        correctAnswer: 0,
        concept: "달의 변화 방향",
        feedback: {
            correct: "맞아요! 보름달 이후에는 달이 점점 작아져요.",
            incorrect: "보름달 이후에는 달이 점점 작아진다는 것을 기억하세요!"
        }
    },
    {
        id: 6,
        question: "달이 왼쪽 반만 밝게 보이는 것은?",
        options: [
            "초승달",
            "상현달",
            "하현달",
            "보름달"
        ],
        correctAnswer: 2,
        concept: "달의 모양",
        feedback: {
            correct: "훌륭해요! 하현달은 왼쪽 반이 밝게 보여요.",
            incorrect: "왼쪽 반이 밝게 보이는 것은 하현달이에요. 시뮬레이터에서 22일째를 확인해보세요!"
        }
    },
    {
        id: 7,
        question: "달이 거의 보이지 않는 가느다란 모양일 때는?",
        options: [
            "초승달 또는 그믐달",
            "상현달",
            "보름달",
            "하현달"
        ],
        correctAnswer: 0,
        concept: "달의 모양",
        feedback: {
            correct: "정답이에요! 가느다란 초승달과 그믐달은 비슷하게 보여요.",
            incorrect: "달이 가느다란 모양일 때는 초승달이나 그믐달이에요."
        }
    },
    {
        id: 8,
        question: "달의 모양 변화 순서가 바르게 나열된 것은?",
        options: [
            "초승달 → 보름달 → 상현달 → 하현달",
            "초승달 → 상현달 → 보름달 → 하현달",
            "상현달 → 초승달 → 하현달 → 보름달",
            "보름달 → 초승달 → 상현달 → 하현달"
        ],
        correctAnswer: 1,
        concept: "달의 순서",
        feedback: {
            correct: "완벽해요! 달의 변화 순서를 정확히 알고 있어요.",
            incorrect: "달은 초승달 → 상현달 → 보름달 → 하현달 → 그믐달 순서로 변해요."
        }
    },
    {
        id: 9,
        question: "약 15일째 되는 날에 보이는 달의 모양은?",
        options: [
            "초승달",
            "상현달",
            "보름달",
            "하현달"
        ],
        correctAnswer: 2,
        concept: "달의 주기와 모양",
        feedback: {
            correct: "정확해요! 15일째쯤 되면 보름달이 되어요.",
            incorrect: "한 달의 중간인 15일째쯤에는 보름달이 된답니다."
        }
    },
    {
        id: 10,
        question: "달의 모양이 매일 변하는 이유는 무엇인가요?",
        options: [
            "달의 크기가 변해서",
            "달이 빛나는 양이 변해서",
            "태양 빛을 받는 달의 부분이 변해서",
            "달이 회전해서"
        ],
        correctAnswer: 2,
        concept: "달의 변화 원리",
        feedback: {
            correct: "대단해요! 달은 태양 빛을 받는 부분이 달라지면서 모양이 변해 보여요.",
            incorrect: "달의 모양 변화는 태양 빛을 받는 달의 부분이 달라지기 때문이에요."
        }
    }
];
