import re
import string

# Self-contained set of standard English stopwords to avoid external runtime download dependencies
ENGLISH_STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
    "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
    "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
    "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
    "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
    "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
    "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
    "they've", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
    "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
    "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
    "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
    "yourself", "yourselves"
}

CONTRACTION_MAP = {
    "won't": "will not",
    "can't": "cannot",
    "i'm": "i am",
    "it's": "it is",
    "he's": "he is",
    "she's": "she is",
    "that's": "that is",
    "what's": "what is",
    "where's": "where is",
    "there's": "there is",
    "who's": "who is",
    "how's": "how is",
    "didn't": "did not",
    "doesn't": "does not",
    "don't": "do not",
    "haven't": "have not",
    "hasn't": "has not",
    "hadn't": "had not",
    "aren't": "are not",
    "isn't": "is not",
    "wasn't": "was not",
    "weren't": "were not",
    "couldn't": "could not",
    "shouldn't": "should not",
    "wouldn't": "would not",
}


def clean_text(text: str, remove_stopwords: bool = True) -> str:
    """
    Standard text normalization pipeline for TF-IDF vectorization:
    1. Type validation and cast to string
    2. Lowercasing
    3. Removal of URLs, emails, and HTML tags
    4. Expansion of common contractions
    5. Removal of punctuation and digits (retaining alphabetical tokens)
    6. Stopword filtering (optional, enabled by default)
    7. Whitespace normalization
    """
    if not isinstance(text, str) or not text.strip():
        return ""

    # 1. Lowercase
    cleaned = text.lower()

    # 2. Remove HTML tags
    cleaned = re.sub(r"<[^>]+>", " ", cleaned)

    # 3. Remove URLs and Emails
    cleaned = re.sub(r"https?://\S+|www\.\S+", " ", cleaned)
    cleaned = re.sub(r"\S+@\S+", " ", cleaned)

    # 4. Expand contractions
    for contraction, expansion in CONTRACTION_MAP.items():
        cleaned = re.sub(r"\b" + re.escape(contraction) + r"\b", expansion, cleaned)

    # 5. Remove punctuation and numbers, keep alphabetical words
    cleaned = re.sub(r"[^a-zA-Z\s]", " ", cleaned)

    # 6. Tokenize by whitespace
    tokens = cleaned.split()

    # 7. Filter stopwords and short tokens
    if remove_stopwords:
        tokens = [token for token in tokens if token not in ENGLISH_STOPWORDS and len(token) > 2]
    else:
        tokens = [token for token in tokens if len(token) > 1]

    return " ".join(tokens)
