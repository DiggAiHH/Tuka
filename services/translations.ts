
export type Language = 'en' | 'tr' | 'es' | 'fr' | 'pl' | 'it' | 'ru' | 'uk' | 'ar';

export const SUPPORTED_LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'Englisch', flag: '🇬🇧' },
    { code: 'tr', label: 'Türkisch', flag: '🇹🇷' },
    { code: 'es', label: 'Spanisch', flag: '🇪🇸' },
    { code: 'fr', label: 'Französisch', flag: '🇫🇷' },
    { code: 'pl', label: 'Polnisch', flag: '🇵🇱' },
    { code: 'it', label: 'Italienisch', flag: '🇮🇹' },
    { code: 'ru', label: 'Russisch', flag: '🇷🇺' },
    { code: 'uk', label: 'Ukrainisch', flag: '🇺🇦' },
    { code: 'ar', label: 'Arabisch', flag: '🇸🇦' }
];

type TranslationKey =
    | 'training'
    | 'task_header'
    | 'hint_btn'
    | 'hint_label'
    | 'check_btn'
    | 'show_steps_btn'
    | 'nearly_correct'
    | 'correct_title'
    | 'result_label'
    | 'next_step_btn'
    | 'next_problem_btn'
    | 'loading_trans';

export const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
    en: {
        training: "Training",
        task_header: "Your Task:",
        hint_btn: "Need a hint?",
        hint_label: "Hint",
        check_btn: "Check!",
        show_steps_btn: "Help / Show Steps",
        nearly_correct: "Almost right! Try again.",
        correct_title: "Correctly Solved!",
        result_label: "Result",
        next_step_btn: "Next Step",
        next_problem_btn: "Next Problem!",
        loading_trans: "Translating..."
    },
    tr: {
        training: "Antrenman",
        task_header: "Görevin:",
        hint_btn: "İpucu lazım mı?",
        hint_label: "İpucu",
        check_btn: "Kontrol et!",
        show_steps_btn: "Yardım / Adımları Göster",
        nearly_correct: "Neredeyse doğru! Tekrar dene.",
        correct_title: "Doğru Çözüldü!",
        result_label: "Sonuç",
        next_step_btn: "Sonraki Adım",
        next_problem_btn: "Sonraki Soru!",
        loading_trans: "Çeviriyor..."
    },
    es: {
        training: "Entrenamiento",
        task_header: "Tu Tarea:",
        hint_btn: "¿Necesitas una pista?",
        hint_label: "Pista",
        check_btn: "¡Comprobar!",
        show_steps_btn: "Ayuda / Mostrar Pasos",
        nearly_correct: "¡Casi correcto! Inténtalo de nuevo.",
        correct_title: "¡Resuelto Correctamente!",
        result_label: "Resultado",
        next_step_btn: "Siguiente Paso",
        next_problem_btn: "¡Siguiente Problema!",
        loading_trans: "Traduciendo..."
    },
    fr: {
        training: "Entraînement",
        task_header: "Ta Tâche:",
        hint_btn: "Besoin d'un indice ?",
        hint_label: "Indice",
        check_btn: "Vérifier !",
        show_steps_btn: "Aide / Montrer les étapes",
        nearly_correct: "Presque correct ! Essaie encore.",
        correct_title: "Correctement résolu !",
        result_label: "Résultat",
        next_step_btn: "Étape Suivante",
        next_problem_btn: "Problème Suivant !",
        loading_trans: "Traduction..."
    },
    pl: {
        training: "Trening",
        task_header: "Twoje Zadanie:",
        hint_btn: "Potrzebujesz wskazówki?",
        hint_label: "Wskazówka",
        check_btn: "Sprawdź!",
        show_steps_btn: "Pomoc / Pokaż kroki",
        nearly_correct: "Prawie dobrze! Spróbuj ponownie.",
        correct_title: "Rozwiązano poprawnie!",
        result_label: "Wynik",
        next_step_btn: "Następny Krok",
        next_problem_btn: "Następne Zadanie!",
        loading_trans: "Tłumaczenie..."
    },
    it: {
        training: "Allenamento",
        task_header: "Il tuo compito:",
        hint_btn: "Hai bisogno di un indizio?",
        hint_label: "Indizio",
        check_btn: "Controlla!",
        show_steps_btn: "Aiuto / Mostra passaggi",
        nearly_correct: "Quasi corretto! Riprova.",
        correct_title: "Risolto Correttamente!",
        result_label: "Risultato",
        next_step_btn: "Passo Successivo",
        next_problem_btn: "Problema Successivo!",
        loading_trans: "Traduzione..."
    },
    ru: {
        training: "Тренировка",
        task_header: "Твоя задача:",
        hint_btn: "Нужна подсказка?",
        hint_label: "Подсказка",
        check_btn: "Проверить!",
        show_steps_btn: "Помощь / Показать шаги",
        nearly_correct: "Почти правильно! Попробуй еще раз.",
        correct_title: "Правильно решено!",
        result_label: "Результат",
        next_step_btn: "Следующий шаг",
        next_problem_btn: "Следующая задача!",
        loading_trans: "Перевод..."
    },
    uk: {
        training: "Тренування",
        task_header: "Твоє завдання:",
        hint_btn: "Потрібна підказка?",
        hint_label: "Підказка",
        check_btn: "Перевірити!",
        show_steps_btn: "Допомога / Показати кроки",
        nearly_correct: "Майже правильно! Спробуй ще раз.",
        correct_title: "Правильно вирішено!",
        result_label: "Результат",
        next_step_btn: "Наступний крок",
        next_problem_btn: "Наступна задача!",
        loading_trans: "Переклад..."
    },
    ar: {
        training: "تدريب",
        task_header: "مهمتك:",
        hint_btn: "هل تحتاج إلى تلميح؟",
        hint_label: "تلميح",
        check_btn: "تحقق!",
        show_steps_btn: "مساعدة / عرض الخطوات",
        nearly_correct: "صحيح تقريبًا! حاول مرة أخرى.",
        correct_title: "تم الحل بشكل صحيح!",
        result_label: "النتيجة",
        next_step_btn: "الخطوة التالية",
        next_problem_btn: "المشكلة التالية!",
        loading_trans: "ترجمة..."
    }
};

export const getTranslation = (lang: string | undefined, key: TranslationKey): string => {
    // If lang is not supported or undefined, return fallback (Empty string? Or English?)
    // But wait, the UI displays German by default.
    // The User wants "Bilingual". So we keep German in the code and ADD this translation.
    if (!lang) return "";
    const dict = TRANSLATIONS[lang as Language];
    return dict ? dict[key] : "";
};
