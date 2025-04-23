//import { useState } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { DELETE_BOOK } from '../utils/mutations';
//import { DELETE_BOOK, SAVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const { data } = useQuery(GET_ME);
  //const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || { savedBooks: [] };

  // Save book mutation
 // const [saveBook] = useMutation(SAVE_BOOK);

  // Delete book mutation
  const [deleteBook] = useMutation(DELETE_BOOK);

  // Function to handle deleting a book
  const handleDeleteBook = async (bookId: string) => {
    if (!Auth.loggedIn()) return false;

    try {
      await deleteBook({
        variables: { bookId },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // OPTIONAL: Function to handle saving a book (e.g. triggered somewhere else)
  // const handleSaveBook = async (bookId: string) => {
  //   const bookToSave = userData.savedBooks.find((book) => book.bookId === bookId);
  //   const token = Auth.loggedIn() ? Auth.getToken() : null;
  //   if (!token || !bookToSave) return false;
  
  //   try {
  //     const { title, authors, description, image, link } = bookToSave;
  
  //     const { data } = await saveBook({
  //       variables: {
  //         bookId,
  //         title,
  //         authors,
  //         description,
  //         image,
  //         link
  //       }
  //     });
  
  //     console.log('Book saved!', data);
  //   } catch (err: any) {
  //     console.error('GraphQL error:', err.message);
  //     if (err.graphQLErrors) console.error('GraphQL Errors:', err.graphQLErrors);
  //     if (err.networkError) console.error('Network Error:', err.networkError);
  //   }
  // };

  // if (loading) {
  //   return <h2>LOADING...</h2>;
  // }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing {userData.username ? `${userData.username}'s` : 'saved'} books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book: { bookId: string; image?: string; title: string; authors: string[]; description: string }) => (
            <Col md='4' key={book.bookId}>
              <Card border='dark'>
                {book.image && <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
