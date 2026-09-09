from transformers import pipeline
from collections import defaultdict

ner_model = pipeline(
        task="token-classification",
        model="babelscape/wikineural-multilingual-ner",
        aggregation_strategy = "simple"
    )


def extract_tags(text:str) -> list[str]:
    """Функция, которая обрабатывает текст и выдает сущности.(NER)

    Args:
        text (str): Текст книги/записи

    Returns:
        list[str]: Сущности найденные в тексте
    """

    raw_result = ner_model(text)
    tags = defaultdict(list)

    for entity in raw_result:
        word = entity["word"].strip()
        confidence = entity["score"]
        group = entity["entity_group"]

        if confidence >= 0.6:
            if word not in tags[group]:
                tags[group].append(word)

    return dict(tags)

print(extract_tags("Себастьян Рашка написал книгу о машинном обучении с использованием TensorFlow"))