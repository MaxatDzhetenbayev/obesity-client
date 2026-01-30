/**
 * Локальная конфигурация полей бланка анкеты.
 * Подписи для формы берутся из locales (questionnaire.blank), здесь — только ключи и порядок для экспорта в XLSX.
 */

export const BLANK_FIELD_KEYS = [
  "age",
  "gender",
  "nationality",
  "region",
  "residenceType",
  "education",
  "educationOther",
  "placeOfWork",
  "height",
  "weight",
];

/** Подписи колонок бланка для выгрузки отчёта (RU) */
export const BLANK_FIELD_LABELS_RU = {
  age: "Возраст",
  gender: "Пол",
  nationality: "Национальность",
  region: "Регион",
  residenceType: "Проживание",
  education: "Образование",
  educationOther: "Другое (образование)",
  placeOfWork: "Место работы",
  height: "Рост (см)",
  weight: "Вес (кг)",
};

/** Перевод значений полей на русский для отчёта (ключ поля -> ключ значения -> русская подпись) */
export const BLANK_FIELD_VALUE_LABELS_RU = {
  gender: {
    male: "Мужской",
    female: "Женский",
  },
  nationality: {
    kazakh: "Казах",
    russian: "Русский",
    uzbek: "Узбек",
    tajik: "Таджик",
    kyrgyz: "Киргиз",
    turkmen: "Туркмен",
    other: "Другое",
  },
  residenceType: {
    city: "Город",
    village: "Село",
  },
  education: {
    higher: "Высшее",
    secondary_special: "Среднее специальное",
    secondary: "Среднее",
    other: "Другое",
  },
};
