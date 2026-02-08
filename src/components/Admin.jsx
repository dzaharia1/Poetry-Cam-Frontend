import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getBackendUrl } from '../utils/api';
import Button from './basecomponents/Button';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  width: 100%;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Section = styled.div`
  background-color: ${(props) => props.theme.colors.paper};
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding-bottom: 0.5rem;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const UserItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const UserEmail = styled.span`
  font-weight: bold;
`;

const UserUid = styled.span`
  font-size: 0.85rem;
  color: ${(props) => props.theme.colors.text.secondary};
  font-family: monospace;
`;

const AddUserForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text.primary};
`;

const ErrorMessage = styled.p`
  color: ${(props) => props.theme.colors.text.error};
  text-align: center;
`;

function Admin() {
    const [allowedUsers, setAllowedUsers] = useState([]);
    const [otherUsers, setOtherUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newUid, setNewUid] = useState('');
    const [adding, setAdding] = useState(false);

    const { theme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/'); // Redirect if not logged in
            } else {
                fetchUsers(user.uid);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchUsers = async (currentUid) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch(getBackendUrl('/admin/users', { userid: currentUid }));

            if (res.status === 403) {
                setError('Access Denied: You are not authorized to view this page.');
                setLoading(false);
                return;
            }

            if (!res.ok) throw new Error('Failed to fetch users');

            const data = await res.json();
            setAllowedUsers(data.allowed || []);
            setOtherUsers(data.others || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load user lists.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (uidToAdd) => {
        if (!uidToAdd) return;
        setAdding(true);
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            const res = await fetch(getBackendUrl('/admin/add-user'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userid: currentUser.uid,
                    newUid: uidToAdd
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to add user');
            }

            // Refresh lists
            await fetchUsers(currentUser.uid);
            setNewUid('');
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setAdding(false);
        }
    };

    const handleManualAdd = (e) => {
        e.preventDefault();
        handleAddUser(newUid);
    };

    if (loading) return <PageContainer>Loading...</PageContainer>;

    if (error) return (
        <PageContainer>
            <ErrorMessage>{error}</ErrorMessage>
            <Button onClick={() => navigate('/')} style={{ marginTop: '1rem' }}>Go Home</Button>
        </PageContainer>
    );

    return (
        <PageContainer theme={theme}>
            <ContentWrapper>
                <Title>Admin Interface</Title>
                <Button onClick={() => navigate('/')} variant="secondary" style={{ alignSelf: 'flex-start' }}>
                    ← Back to Home
                </Button>

                <Section theme={theme}>
                    <SectionTitle theme={theme}>Whitelisted Users ({allowedUsers.length})</SectionTitle>
                    <UserList>
                        {allowedUsers.map(u => (
                            <UserItem key={u.uid} theme={theme}>
                                <UserInfo>
                                    <UserEmail>{u.email || 'No Email'}</UserEmail>
                                    <UserUid theme={theme}>{u.uid}</UserUid>
                                </UserInfo>
                                {/* Could add delete button here later */}
                            </UserItem>
                        ))}
                    </UserList>

                    <AddUserForm onSubmit={handleManualAdd}>
                        <Input
                            theme={theme}
                            placeholder="Manually add UID"
                            value={newUid}
                            onChange={(e) => setNewUid(e.target.value)}
                            disabled={adding}
                        />
                        <Button type="submit" disabled={adding || !newUid}>
                            {adding ? 'Adding...' : 'Add UID'}
                        </Button>
                    </AddUserForm>
                </Section>

                <Section theme={theme}>
                    <SectionTitle theme={theme}>Other Registered Users ({otherUsers.length})</SectionTitle>
                    {otherUsers.length === 0 ? (
                        <p>No other registered users found.</p>
                    ) : (
                        <UserList>
                            {otherUsers.map(u => (
                                <UserItem key={u.uid} theme={theme}>
                                    <UserInfo>
                                        <UserEmail>{u.email || 'No Email'}</UserEmail>
                                        <UserUid theme={theme}>{u.uid}</UserUid>
                                    </UserInfo>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleAddUser(u.uid)}
                                        disabled={adding}
                                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                                    >
                                        Add
                                    </Button>
                                </UserItem>
                            ))}
                        </UserList>
                    )}
                </Section>
            </ContentWrapper>
        </PageContainer>
    );
}

export default Admin;
