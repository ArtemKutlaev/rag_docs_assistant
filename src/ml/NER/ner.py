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
        dict[str, list[str]]: Словарь сущностей, сгруппированных по типу.
    """

    raw_result = ner_model(text)
    tags = defaultdict(list)

    for entity in raw_result:
        word = entity["word"].strip()
        confidence = entity["score"]
        group = entity["entity_group"]

        if confidence >= 0.7:
            if word not in tags[group]:
                tags[group].append(word)

    return dict(tags)