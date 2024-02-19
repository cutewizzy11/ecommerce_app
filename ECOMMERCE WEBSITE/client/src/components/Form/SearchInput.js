import React from "react";
import { useSearch } from "../../context/search";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (transcript) {
        setValues({ ...values, keyword: transcript });
        resetTranscript();
      }
  
      const timestamp = new Date().getTime();
      const keyword = encodeURIComponent(values.keyword);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/search/${keyword}?timestamp=${timestamp}`
      );
      
      console.log(response.data); // Log the response data
  
      setValues({ ...values, results: response.data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div>
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={transcript || values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
        <button
          onClick={() => {
            SpeechRecognition.startListening();
          }}
        >
          Start Listening
        </button>
        <button
          onClick={() => {
            SpeechRecognition.stopListening();
          }}
        >
          Stop Listening
        </button>
        <button
          onClick={() => {
            resetTranscript();
          }}
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
