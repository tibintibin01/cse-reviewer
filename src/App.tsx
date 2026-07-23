import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { getProfileName, setProfileName } from './lib/storage';
import NameGate from './components/NameGate';
import Layout from './components/Layout';
import Home from './pages/Home';
import Practice from './pages/Practice';
import Mock from './pages/Mock';
import Review from './pages/Review';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import History from './pages/History';
import Treasury from './pages/Treasury';

export default function App() {
  const [name, setName] = useState<string>(() => getProfileName());

  if (!name) {
    return (
      <NameGate
        onSubmit={(n) => {
          setProfileName(n);
          setName(n);
        }}
      />
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/mock" element={<Mock />} />
        <Route path="/review" element={<Review />} />
        <Route path="/treasury" element={<Treasury />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
