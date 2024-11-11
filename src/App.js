
import './App.css';
import Navbar from './components/navbar';
import Footer from './components/footer';
import GameList from './components/gamelist';


function App() {
  return (
    <div className="App">
      <Navbar />
      <GameList />
      <Footer />
    </div>
  );
}

export default App;
