import { render, screen } from "@testing-library/react";
import App from "./App";
import { HashRouter } from "react-router-dom";

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
  window.location.hash = "";
  localStorage.clear();
});

test("renders the home page headline", async () => {
  render(
    <HashRouter>
      <App />
    </HashRouter>
  );
  expect(await screen.findByText(/compare care options by price, distance, and ai symptom triage/i)).toBeInTheDocument();
});
