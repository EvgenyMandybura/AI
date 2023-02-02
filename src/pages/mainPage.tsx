import {useState} from 'react';
import {getImage} from '../Services/getTextToImage';

export const MainPage = () => {
  const [value, setValue] = useState<string>('');
  const [image, setImage] = useState<string | undefined>('');

  const onGetImage = async () => {
    setImage(await getImage(value));
  };

  return (
    <div>
      <div>
        <input
          onChange={(newValue) => {
            setValue(newValue.target.value);
          }}
          defaultValue={value}
          value={value}
        />
        <button onClick={onGetImage}>Generate image</button>
      </div>
      {image ? <img src={image} alt="img" /> : 'Loading... Image loading may take a couple of minutes.'}
    </div>
  );
};
