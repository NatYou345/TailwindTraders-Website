import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

vi.hoisted(() => {
  globalThis.localStorage = {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
});

vi.mock('./pages/home/components/videoCall/Meeting', () => ({ default: () => null }));
vi.mock('./shared/debugHeader/debugHeader', () => ({ default: () => null }));
vi.mock('./helpers/toast.js', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));
vi.mock('./services/configService', () => ({
  default: {
    loadSettings: vi.fn().mockResolvedValue(undefined),
    _applicationInsightsIntrumentationKey: null,
  },
  _applicationInsightsIntrumentationKey: null,
}));

import App from './App';
import store from './store';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
    div
  );
  root.unmount();
});
