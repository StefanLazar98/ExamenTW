import { Navbar, Nav, Container } from 'react-bootstrap';
// PENTRU NAVIGATION TREBUIE SA : npm install bootstrap si react-bootstrap (din pakage.json); SA RULEZI npm install --save bootstrap SI SA ADAUGI BIBLIOTECA IN MARELE index.js
const Navigation = () => {
    function logOut() {
        alert('you were logged out')
    }
    return (
        <>
            <Navbar collapseOnSelect fixed='top' expand='sm' bg='dark' variant='dark'>
                <Container>

                </Container>

            </Navbar>
        </>
    );
}

export default Navigation;