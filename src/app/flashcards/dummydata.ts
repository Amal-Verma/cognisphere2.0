// dummydata.ts - Flashcards dummy data
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface FlashcardSet {
  title: string;
  description: string;
  cards: Flashcard[];
}

// Dummy flashcard data for a programming course
export const dummyFlashcardSet: FlashcardSet = {
  title: "Introduction to Programming",
  description: "Essential concepts and terminology for programming fundamentals",
  cards: [
    {
      id: "1",
      front: "What is a **variable** in programming?",
      back: "A variable is a storage location with a name that holds data. It can store different types of values like numbers, text, or boolean values, and its value can be changed during program execution.",
      category: "Basics",
      difficulty: "easy"
    },
    {
      id: "2",
      front: "What is the difference between `==` and `===` in JavaScript?",
      back: "`==` performs type coercion and compares values after converting them to the same type, while `===` is a strict equality operator that compares both value and type without any conversion.",
      category: "JavaScript",
      difficulty: "medium"
    },
    {
      id: "3",
      front: "What is a **function**?",
      back: "A function is a reusable block of code that performs a specific task. It can take inputs (parameters), process them, and return an output. Functions help organize code and avoid repetition.",
      category: "Basics",
      difficulty: "easy"
    },
    {
      id: "4",
      front: "What is **recursion**?",
      back: "Recursion is a programming technique where a function calls itself to solve a problem. It typically has a base case (stopping condition) and a recursive case that breaks the problem into smaller subproblems.",
      category: "Advanced",
      difficulty: "hard"
    },
    {
      id: "5",
      front: "What is the difference between `let`, `const`, and `var` in JavaScript?",
      back: "`var` has function scope and can be redeclared, `let` has block scope and can be reassigned but not redeclared, `const` has block scope and cannot be reassigned or redeclared.",
      category: "JavaScript",
      difficulty: "medium"
    },
    {
      id: "6",
      front: "What is an **array**?",
      back: "An array is a data structure that stores multiple values in a single variable. Elements are accessed using an index (usually starting from 0), and arrays can hold different types of data.",
      category: "Data Structures",
      difficulty: "easy"
    },
    {
      id: "7",
      front: "What is **Big O notation**?",
      back: "Big O notation describes the performance or complexity of an algorithm in terms of time or space as the input size grows. It helps compare algorithm efficiency (e.g., O(1), O(n), O(n²)).",
      category: "Algorithms",
      difficulty: "hard"
    },
    {
      id: "8",
      front: "What is a **loop**?",
      back: "A loop is a programming construct that repeats a block of code multiple times until a specified condition is met. Common types include for loops, while loops, and do-while loops.",
      category: "Control Flow",
      difficulty: "easy"
    },
    {
      id: "9",
      front: "What is **object-oriented programming (OOP)**?",
      back: "OOP is a programming paradigm based on the concept of 'objects' that contain data (attributes) and code (methods). Key principles include encapsulation, inheritance, polymorphism, and abstraction.",
      category: "Paradigms",
      difficulty: "medium"
    },
    {
      id: "10",
      front: "What is the difference between **stack** and **heap** memory?",
      back: "Stack memory stores local variables and function calls in a LIFO order, it's fast but limited in size. Heap memory stores dynamically allocated objects, it's larger but slower to access.",
      category: "Memory Management",
      difficulty: "hard"
    }
  ]
};

// Default flashcard state
export const dummyFlashcardState = {
  currentCardIndex: 0,
  isFlipped: false,
  studiedCards: [] as string[],
  masteredCards: [] as string[],
  showBack: false
};
