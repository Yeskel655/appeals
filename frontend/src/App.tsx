import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './redux/app/store.js'; // Предположим, ваш store находится в файле ./store
import AppealDetails from './components/AppealDetails.js';
import AppealsTable from './components/AppealsTable.jsx';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<AppealsTable />} />
          <Route path="/appeals/:id" element={<AppealDetails />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
