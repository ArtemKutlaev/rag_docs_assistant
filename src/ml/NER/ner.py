from transformers import pipeline

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
    tags =[]
    for entity in raw_result:
        word = entity["word"].strip()
        confidence = entity["score"]
        group = entity["entity_group"]
        if confidence >= 0.8:
            tags.append(f"[{group}] {word}")
    unique_tags = list(dict.fromkeys(tags))
    return unique_tags

