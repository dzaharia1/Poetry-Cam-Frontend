import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from './basecomponents/Modal';
import TextInput from './basecomponents/TextInput';
import Dropdown from './basecomponents/Dropdown';
import Button from './basecomponents/Button';
import { getBackendUrl } from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import { auth } from '../firebase';

const SettingsContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;


const Link = styled.a`
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.text.link};
  text-decoration: none;
  align-self: flex-start;
  margin-top: -0.5rem;
  margin-bottom: 1rem;

  &:hover {
    text-decoration: underline;
  }

  &:visited {
    color: ${(props) => props.theme.colors.text.link};
  }
`;

const Timezones = Intl.supportedValuesOf('timeZone').map((tz) => ({
  label: tz,
  value: tz,
}));

const ThemeOptions = [
  { label: 'Auto (System)', value: 'auto' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

const Settings = ({ isOpen, onClose, missingApiKey }) => {
  const { themeMode, setThemeMode } = useTheme();
  const [formData, setFormData] = useState({
    geminiApiKey: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    themeMode: themeMode,
    penName: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (missingApiKey) {
      setErrors((prev) => ({
        ...prev,
        geminiApiKey: 'API Key is required to use this device.',
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.geminiApiKey;
        return newErrors;
      });
    }
  }, [missingApiKey, isOpen]);

  // Sync internal state with context when context changes (e.g. if set from elsewhere)
  useEffect(() => {
    setFormData((prev) => ({ ...prev, themeMode }));
  }, [themeMode]);

  useEffect(() => {
    if (isOpen && auth.currentUser) {
      setLoading(true);
      fetch(
        getBackendUrl('/get-settings', { userid: auth.currentUser.uid }),
      )
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            geminiApiKey: '', // Always blank on load for security
            timezone: data.timezone || prev.timezone,
            themeMode: data.themeMode || 'auto',
            penName: data.penName || '',
          }));
          // Ideally sync theme context with fetching setting if different
          if (data.themeMode && data.themeMode !== themeMode) {
            setThemeMode(data.themeMode);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Live preview for theme
    if (name === 'themeMode') {
      setThemeMode(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    const payload = { ...formData };
    // Only send API key if provided
    if (!payload.geminiApiKey) {
      delete payload.geminiApiKey;
    }

    try {
      const res = await fetch(
        getBackendUrl('/update-settings'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userid: auth.currentUser.uid,
            settings: payload,
          }),
        },
      );

      if (res.ok) {
        setMsg('Settings saved!');
        setTimeout(() => {
          onClose();
          setMsg('');
        }, 1000);
      } else {
        setMsg('Failed to save settings.');
      }
    } catch (err) {
      console.error(err);
      setMsg('Error saving settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <SettingsContainer onSubmit={handleSubmit} autoComplete="off">
        <TextInput
          label="Pen Name"
          name="penName"
          value={formData.penName}
          onChange={handleChange}
          placeholder="e.g. The Bard"
        />

        <Dropdown
          label="Theme"
          name="themeMode"
          value={formData.themeMode}
          options={ThemeOptions}
          onChange={handleChange}
        />

        <Dropdown
          label="Timezone"
          name="timezone"
          value={formData.timezone}
          options={Timezones}
          onChange={handleChange}
        />

        <TextInput
          label="Gemini API Key"
          name="geminiApiKey"
          type="password"
          value={formData.geminiApiKey}
          onChange={handleChange}
          placeholder={loading ? 'Loading...' : '••••••••••••••••'}
          autoComplete="new-password"
          error={errors.geminiApiKey}
        />
        <Link
          href="https://ai.google.dev/gemini-api/docs/api-key"
          target="_blank"
          rel="noopener noreferrer">
          Get an API key from Google AI Studio
        </Link>

        {msg && (
          <p
            style={{
              marginBottom: '1rem',
              color:
                msg.includes('Failed') || msg.includes('Error')
                  ? 'red'
                  : 'green',
            }}>
            {msg}
          </p>
        )}

        <Button
          type="submit"
          disabled={saving || loading}
          style={{ width: '100%' }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </SettingsContainer>
    </Modal>
  );
};

export default Settings;
