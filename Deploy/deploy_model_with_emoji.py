import re
import pandas as pd
# from nltk.corpus import stopwords
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
# import nltk
import pandas as pd
import numpy as np
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.optimizers import Adam

import numpy as np
from keras.models import load_model
# from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

df = pd.read_csv("../../../singkatan-lib.csv")

# ubah jadi dictionary {singkatan: normalisasi}
mapping = dict(zip(df['singkatan'], df['normalisasi']))
# print(mapping)

dt = pd.read_csv("../../../kamus_alay.csv")

# ubah jadi dictionary {singkatan: normalisasi}
mapping_slang = dict(zip(dt['slang'], dt['normalisasi']))
# print(mapping_slang)

mapping_tambahan = {
    "jowo" : "jawa",
    "meduro" : "madura",
    "meksiko" : "mexico",
    "vindavana" : "vrindavan",
    "frindavan" : "vrindavan",
    "frindapan" : "vrindavan",
    "prindavan"  : "vrindavan",
    "frindafan" : "vrindavan",
    "prindapan"  : "vrindavan",
    "vrindapan" : "vrindavan",
    "vrindafan" : "vrindavan",
}

import re

def normalize_laughter(token):
    # cocokkan pola 'wk' atau variasi 'wkwkwkwk' / 'wkkwkwkw'
    if re.fullmatch(r'(w|k){3,}', token):  # hanya huruf w dan k dengan panjang >3
        return 'wkwk'
    elif re.fullmatch(r'(ha){2,}', token):  # untuk 'hahaha', 'hahahah'
        return 'haha'
    return token

import re
import pandas as pd
# from nltk.corpus import stopwords
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
import nltk
import pandas as pd
from indoNLP.preprocessing import replace_word_elongation
from indoNLP.preprocessing import emoji_to_words, replace_slang

from nltk.stem import WordNetLemmatizer, PorterStemmer

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('wordnet')

# Initialize lemmatizer and stemmer
stopword = StopWordRemoverFactory()
stemmer_factory = StemmerFactory()
stemmer = stemmer_factory.create_stemmer()

import emoji

def preprocessing(text, oov_token="<OOV>"):       
    # hapus mention @username
    text = re.sub(r'@\S+', '', text)
    text = re.sub(r'([a-zA-Z0-9])([\U0001F600-\U0001F64F'
                  r'\U0001F300-\U0001F5FF'
                  r'\U0001F680-\U0001F6FF'
                  r'\U0001F1E0-\U0001F1FF])', r'\1 \2', text)
    text = re.sub(r'[^a-zA-Z\s' 
                  r'\U0001F600-\U0001F64F'  # emotikon wajah
                  r'\U0001F300-\U0001F5FF'  # simbol & pictograph
                  r'\U0001F680-\U0001F6FF' 
                  r'\U0001F1E0-\U0001F1FF'
                  r']+', ' ', text, flags=re.UNICODE)
    
    text = re.sub(r'\s+', ' ', text).strip()          # hapus spasi ganda
    text = text.strip()  # Remove leading/trailing whitespace
    # 1. Remove special characters, numbers, and extra spaces
    # text = re.sub(r'[^A-Za-z\s]', '', text)  # Remove special charactersx

    text = text.lower()  # Convert to lowercase

    
    text = re.sub(r'(.)\1{2,}', r'\1', text)          # huruf berulang >2 jadi 1
    text = replace_word_elongation(text)  
     
    text = emoji.replace_emoji(
            text,
            replace=lambda e, data: f" <EMOJI_{emoji.demojize(e).strip(':').upper()}> "
        )
    text = replace_slang (text)

    tokens = nltk.word_tokenize(text)


    tokens = [mapping_tambahan.get(word, word) for word in tokens]

    tokens = [normalize_laughter(t) for t in tokens]

    tokens = [mapping.get(word, word) for word in tokens]
    tokens = [mapping_slang.get(word, word) for word in tokens]

    # tokens = [stemmer.stem(word) for word in tokens]
    
    text = ' '.join(tokens)
    return text



from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Initialize Flask app
app = Flask(__name__)

from tensorflow.keras.layers import Layer
import tensorflow as tf

# === 1. Attention Layer ===
class Attention(Layer):
    def __init__(self, **kwargs):
        super(Attention, self).__init__(**kwargs)
    
    def build(self, input_shape):
        self.W = self.add_weight(name='att_weight',
                                 shape=(input_shape[-1], 1),
                                 initializer='random_normal',
                                 trainable=True)
        self.b = self.add_weight(name='att_bias',
                                 shape=(input_shape[1], 1),
                                 initializer='zeros',
                                 trainable=True)
        super(Attention, self).build(input_shape)
    
    def call(self, x):
        e = tf.keras.backend.tanh(tf.keras.backend.dot(x, self.W) + self.b)
        a = tf.keras.backend.softmax(e, axis=1)
        output = a * x
        return output  # tetap 3D untuk Conv1D

# Load your pre-trained model
model = tf.keras.models.load_model('model_random_search_lowercase_emoji_convert_9010.h5', custom_objects={"Attention": Attention()})

import numpy as np
from keras.models import load_model
# from tensorflow.keras.preprocessing.text import Tokenizer
from keras_preprocessing.sequence import pad_sequences

vocab_size = 10000
max_length = 20
trunc_type = 'post'
oov_tok = "<OOV>"

data = pd.read_csv('data_cleaning_lowercase_emoji_convert.csv')
data = data[~(data['Comment'].isna() | (data['Comment'].str.strip() == ""))]

# data["Comment"] = data["Comment"].apply(preprocessing)

comments = data['Comment'].tolist()
labels = pd.get_dummies(data['Label']).values



from sklearn.model_selection import train_test_split

tokenizer = Tokenizer(num_words=vocab_size, oov_token=oov_tok)
tokenizer.fit_on_texts(comments)
sequences = tokenizer.texts_to_sequences(comments)
padded_sequences = pad_sequences(sequences, maxlen=max_length, truncating=trunc_type)

X_train, X_val, y_train, y_val = train_test_split(padded_sequences, labels, test_size=0.1, random_state=42)


tokenizer = Tokenizer(num_words=vocab_size, oov_token=oov_tok)
tokenizer.fit_on_texts(comments)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse the input JSON data
        data = request.get_json()

        # Assuming `texts_to_predict` is sent as a list of strings in the JSON
        texts_to_predict = data.get('texts', [])

        if not texts_to_predict:
            return jsonify({"error": "No texts provided for prediction"}), 400

        # Preprocess the texts (assuming you have a preprocessing function)
        cleaned_texts = [preprocessing(text) for text in texts_to_predict]
        print(cleaned_texts)

        # Tokenize and pad the texts
        sequences = tokenizer.texts_to_sequences(cleaned_texts)
        print(sequences)
        padded_sequences = pad_sequences(sequences, maxlen=max_length, truncating='post')
        
        print(padded_sequences)

        # Get predictions from the model
        predictions = model.predict(padded_sequences)

        # Get predicted labels
        predicted_labels = np.argmax(predictions, axis=1)

        # Prepare the response with predictions for each input text
        response = []
        for i, text in enumerate(texts_to_predict):
            label = int(predicted_labels[i])

            if len(text.split()) == 1:
                label = 0
            response.append({
                'raw_text': text,
                'preprocessed_text': cleaned_texts[i],
                'predicted_label': label,
                'label_text': "Rasis" if int(predicted_labels[i]) == 1 else "Tidak rasis",
                'prediction_probabilities': predictions[i].tolist()
            })

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
