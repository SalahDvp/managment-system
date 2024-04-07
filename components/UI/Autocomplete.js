import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';

  
  const AutosuggestComponent = ({trainers,setReservation,reservation,name,field}) => {
  
    const [suggestionsList, setSuggestionsList] = useState([]);

    // Autosuggest input value change handler
    const onChange = (event, { newValue }) => {
        setReservation(prevReservation => ({
            ...prevReservation,
            [field]: newValue,
          }));
    };
  
    // Autosuggest input focus handler
    const onFocus = () => {

      setSuggestionsList(trainers); // Show all suggestions when input is focused
    };
  


    // Autosuggest input suggestions fetch handler
    const onSuggestionsFetchRequested = ({ value }) => {

   
      setSuggestionsList(
        trainers.filter((suggestion) =>
    suggestion.nameandsurname.toLowerCase().includes(value.toLowerCase())
        )
      );
    };
  
    // Autosuggest input suggestions clear handler
    const onSuggestionsClearRequested = () => {
      setSuggestionsList([]);
    };
  
    // Render suggestion item
    const renderSuggestion = (suggestion) => (
      <div>{suggestion.nameandsurname}</div>
    );
  
    // Autosuggest input props
    const inputProps = {
      placeholder: 'Type something...',
      value:name,
      onChange,
      onFocus,

      
    };
  
    return (
      <Autosuggest
      theme={{
        container: 'autosuggest-container',
        input: 'autosuggest-input',
        suggestionsContainer: 'autosuggest-suggestions-container',
        suggestion: 'autosuggest-suggestion',
        suggestionHighlighted: 'autosuggest-suggestion--selected',
      }}

        suggestions={suggestionsList}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(suggestion) => suggestion.nameandsurname}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  };

export default AutosuggestComponent;