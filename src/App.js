import './App.css';
import axios from 'axios';
import {useState,useEffect,useCallback} from 'react';
import uuid from 'react-uuid'
import Ingredient from './Ingredient';

const URL ='https://www.thecocktaildb.com/api/json/v1/1/random.php';
const URL_SEARCH = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

function App() {
  const [name, setName] = useState('');
  const [glass, setGlass] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState('');
  
  function doSearch(e) {
    e.preventDefault();
    getData(URL_SEARCH + search); 
  }

  /**
   * Define callback function to retrieve data from backend. Function is declared in a way, that it can be also
   * called form useEffect without warnings.
   */
  const getData = useCallback(async(url) => {
    axios.get(url)
    .then((response ) => {
      if (response.data.drinks!=null) {
        const drink = response.data.drinks[0];
        setName(drink.strDrink);
        setGlass(drink.strGlass);
        setInstructions(drink.strInstructions);

        const ingredientsArr = [];

        // Loop through ingredients. JSON contains possibly 15 ingredients and only thos which do have some content
        // are taken into account.
        for (let i = 1;i<=15;i++) {
          if (drink['strIngredient' + i]) {
            ingredientsArr.push(new Ingredient(drink['strIngredient' + i],drink['strMeasure' + i]));
          }
        }
        
        setIngredients(ingredientsArr);    
      } else {
        alert("No drinks found!");
      } 
    }).catch(error => {
      alert(error);
    });
    },[]
  )

  useEffect(()=> {
    getData(URL);
  },[getData])

  return (
    <div>
      <h1>Coctail of the day</h1>
      <form onSubmit={doSearch}>
        <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name"/><button>Search</button>
      </form>
      <h2>{name}</h2>
      <h3>Glass</h3>
      <p>{glass}</p>
      <h3>Instructions</h3>
      <p>{instructions}</p>
      <ul>
        {ingredients.map(ingredient => (
          <li key={uuid()}>{ingredient.name} {ingredient.measure}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
