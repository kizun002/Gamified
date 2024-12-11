import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';

export default function App() {
  const [progress, setProgress] = useState(0); // Tracks progress
  const [currentLevel, setCurrentLevel] = useState(1); // Unlocked levels
  const [xp, setXP] = useState(0); // Experience points
  const [questionVisible, setQuestionVisible] = useState(false); // Modal visibility
  const [currentQuestion, setCurrentQuestion] = useState(null); // Current question data
  const [levelQuestions, setLevelQuestions] = useState([]); // Current level questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Tracks which question is shown

  // Questions grouped per level
  const levels = [
    {
      level: 1,
      questions: [
        {
          question: 'What does HTML stand for?',
          options: ['HyperText Markup Language', 'HyperTransfer Main Link', 'HyperText Main Language'],
          answer: 'HyperText Markup Language',
        },
        {
          question: 'Which tag is used for images in HTML?',
          options: ['<img>', '<picture>', '<image>'],
          answer: '<img>',
        },
      ],
    },
    {
      level: 2,
      questions: [
        {
          question: 'What is React Native?',
          options: ['Mobile App Framework', 'Game Engine', 'Web Browser'],
          answer: 'Mobile App Framework',
        },
        {
          question: 'Which component is used for touch events?',
          options: ['TouchableOpacity', 'Pressable', 'Button'],
          answer: 'TouchableOpacity',
        },
      ],
    },
    {
      level: 3,
      questions: [
        {
          question: 'Which language is used for styling web pages?',
          options: ['Python', 'CSS', 'Java'],
          answer: 'CSS',
        },
        {
          question: 'How do you apply styles in React Native?',
          options: ['CSS', 'Stylesheet', 'Inline'],
          answer: 'Stylesheet',
        },
      ],
    },
  ];

  // Start Level (Opens Modal)
  const startLevel = (level) => {
    const selectedLevel = levels.find((l) => l.level === level);
    setLevelQuestions(selectedLevel.questions);
    setCurrentQuestionIndex(0);
    setCurrentQuestion(selectedLevel.questions[0]);
    setQuestionVisible(true);
  };

  // Validate Answer
  const checkAnswer = (selectedOption) => {
    if (selectedOption === currentQuestion.answer) {
      Alert.alert('Correct!', 'You answered correctly 🎉');
      setXP(xp + 50);

      // Move to next question or finish level
      if (currentQuestionIndex + 1 < levelQuestions.length) {
        const nextQuestionIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextQuestionIndex);
        setCurrentQuestion(levelQuestions[nextQuestionIndex]);
      } else {
        // Level Complete
        setProgress(progress + 1 / levels.length);
        setCurrentLevel(currentLevel + 1);
        Alert.alert('Level Complete!', `You've completed Level ${currentLevel} 🎖️`);
        setQuestionVisible(false);
      }
    } else {
      Alert.alert('Oops!', 'Wrong answer. Try again!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <Icon name="heart" size={24} color="#FF6B6B" />
          <Text style={styles.headerText}>5</Text>
        </View>
        <View style={styles.headerItem}>
          <Icon name="coin" size={24} color="#FFD700" />
          <Text style={styles.headerText}>{xp} XP</Text>
        </View>
        <View style={styles.headerItem}>
          <Progress.Circle size={50} progress={progress} color="#7FB3D5" />
        </View>
      </View>

      {/* Levels - Step-wise Layout */}
      <ScrollView contentContainerStyle={styles.levelContainer}>
        {levels.map((levelData) => (
          <View key={levelData.level} style={styles.levelWrapper}>
            <TouchableOpacity
              style={[
                styles.levelCircle,
                levelData.level > currentLevel && styles.lockedLevel,
              ]}
              disabled={levelData.level > currentLevel}
              onPress={() => startLevel(levelData.level)}
            >
              {levelData.level <= currentLevel ? (
                <Icon name="check-circle" size={50} color="#6C5CE7" />
              ) : (
                <Icon name="lock" size={50} color="#888" />
              )}
              <Text style={styles.levelText}>
                {levelData.level <= currentLevel
                  ? `Level ${levelData.level}`
                  : 'Locked'}
              </Text>
            </TouchableOpacity>
            {/* Connector */}
            {levelData.level < levels.length && (
              <View style={styles.connector}></View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Question Modal */}
      <Modal
        visible={questionVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setQuestionVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.questionText}>{currentQuestion?.question}</Text>
            {currentQuestion?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => checkAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E2E' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#2C2C4E',
  },
  headerItem: { alignItems: 'center' },
  headerText: { color: '#FFF', marginTop: 5 },
  levelContainer: { alignItems: 'center', paddingVertical: 20 },
  levelWrapper: { alignItems: 'center' },
  levelCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6C5CE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  lockedLevel: { backgroundColor: '#444' },
  levelText: { color: '#FFF', marginTop: 5 },
  connector: {
    width: 4,
    height: 30,
    backgroundColor: '#6C5CE7',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#353567',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  questionText: { color: '#FFF', fontSize: 18, marginBottom: 10 },
  optionButton: {
    backgroundColor: '#6C5CE7',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  optionText: { color: '#FFF', textAlign: 'center' },
});
