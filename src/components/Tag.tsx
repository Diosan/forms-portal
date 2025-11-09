import React, { useState } from 'react';
import { render } from 'react-dom';
import { COUNTRIES } from '../tagger/countries';
import '../assets/Tagger.css';
import { WithContext as ReactTags } from 'react-tag-input';

const suggestions = COUNTRIES.map(country => {
  return {
    id: country,
    text: country
  };
});

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const Tagger = () => {
  const [tags, setTags] = React.useState([
    { id: 'Thailand', text: 'Thailand' },
    { id: 'Phillipines', text: 'Phillipines' },
    { id: 'Colombia', text: 'Colombia' },
    { id: 'Brazil', text: 'Brazil' }
  ]);

  const handleDelete = (i: any) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: any) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag: any, currPos:any, newPos: any) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index: any) => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  return (
    <div className="app">
      <h1> React Tags Example </h1>
      <div>
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          inputFieldPosition="bottom"
          autocomplete
        />
      </div>
    </div>
  );

}


export default Tagger