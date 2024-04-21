import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import { ScreenContent } from 'components/ScreenContent';
import { RootStackParamList } from '../navigation';
 
type Character = {
  name: string;
  height: string;
  gender: string;
  url: string;
};
 
type OverviewScreenNavigationProps = StackNavigationProp<RootStackParamList, 'Overview'>;
 
export default function Overview() {
  const navigation = useNavigation<OverviewScreenNavigationProps>();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
 
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('https://swapi.dev/api/people/');
        const data = await response.json();
        setCharacters(data.results);
      } catch (error) {
        console.error('Error fetching Star Wars characters: ', error);
      }
    };
 
    fetchCharacters();
  }, []);
 
  const openDetailsModal = (character: Character) => {
    setSelectedCharacter(character);
  };
 
  const closeDetailsModal = () => {
    setSelectedCharacter(null);
  };
 
  return (
    <View style={styles.container}>
      <ScreenContent path="screens/overview.tsx" title="Overview" />
      <Text style={styles.title}>Star Wars Characters</Text>
      <FlatList
        data={characters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.character}>
            <Image
              source={{ uri: `https://starwars-visualguide.com/assets/img/characters/${getImageId(item.url)}.jpg` }}
              style={styles.image}
            />
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => openDetailsModal(item)}>
              <Text style={styles.buttonText}>Ver Detalhes</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal
        visible={selectedCharacter !== null}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCharacter && (
              <>
                <Text style={styles.modalTitle}>{selectedCharacter.name}</Text>
                <Text style={styles.modalText}>Height: {selectedCharacter.height} cm</Text>
                <Text style={styles.modalText}>Gender: {selectedCharacter.gender}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeDetailsModal}>
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
 
const getImageId = (url: string) => {
  const matches = url.match(/\/(\d+)\/$/);
  return matches ? matches[1] : null;
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  character: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 75,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});