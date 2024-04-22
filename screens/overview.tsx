import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Modal, Image } from 'react-native';
import { RootStackParamList } from 'navigation';

type Character = {
  name: string;
  height: string;
  gender: string;
  hair_color: string;
  eye_color: string;
  birth_year: string;
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
        const response = await fetch('https://swapi.py4e.com/api/people/');
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
      <Text style={styles.title}>Personagens de Star Wars </Text>
      <FlatList
        data={characters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.character}
            onPress={() => openDetailsModal(item)}
          >
            <Image
              source={{ uri: `https://starwars-visualguide.com/assets/img/characters/${getImageId(item.url)}.jpg` }}
              style={styles.image}
            />
            <View style={styles.characterDetails}>
              <Text style={styles.name}>{item.name}</Text>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => openDetailsModal(item)}
              >
                <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
      <Modal
        visible={selectedCharacter !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={closeDetailsModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCharacter && (
              <>
                <Text style={styles.modalTitle}>{selectedCharacter.name}</Text>
                <Text style={styles.modalText}>Altura: {selectedCharacter.height} cm</Text>
                <Text style={styles.modalText}>Gênero: {selectedCharacter.gender}</Text>
                <Text style={styles.modalText}>Cor do cabelo: {selectedCharacter.hair_color}</Text>
                <Text style={styles.modalText}>Cor dos olhos: {selectedCharacter.eye_color}</Text>
                <Text style={styles.modalText}>Ano de Nascimento: {selectedCharacter.birth_year}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeDetailsModal}
                >
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
    backgroundColor: '#663399',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
  character: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  characterDetails: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsButton: {
    backgroundColor: '#663399',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#663399',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333333',
  },
  closeButton: {
    backgroundColor: '#663399',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});

