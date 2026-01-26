import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { dateUtils } from '../utils/dateUtils';
import { SafeAreaView } from 'react-native-safe-area-context';


type JFTDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JFTDetail'>;
  route: RouteProp<RootStackParamList, 'JFTDetail'>;
};

const JFTDetailScreen: React.FC<JFTDetailScreenProps> = ({ navigation, route }) => {
  const { date, content } = route.params;

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.date}>{dateUtils.formatDisplayDate(date)}</Text>
        <Text style={styles.title}>{content.title}</Text>
        <View style={[styles.dividerline, styles.dividerLarge]} />

        <Text style={styles.quote}>"{content.quote}"</Text>
        <Text style={styles.reference}>{content.reference}</Text>
        {/* <View style={[styles.dividerline, styles.dividerSmall]} /> */}
        <View style={styles.liteDivider} />

        <Text style={styles.content}>{content.fullContent}</Text>
        <View style={[styles.dividerline, styles.dividerSmall]} />
        <Text style={ styles.jftTitle}>Just for today: </Text>
        <Text style={styles.content}> {content.justForToday}</Text>
        


      </ScrollView>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8DFF5',
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    fontSize: 18,
    color: '#9B6FDD',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  date: {
    fontSize: 14,
    color: '#704aaaff',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D1B4E',
    margin: 8,
  },
  divider: {
    height: 2,
    backgroundColor: '#E8DFF5',
    marginBottom: 20,
    
  },
    dividerline: {
    backgroundColor: '#E8DFF5',
    marginBottom: 10,
    },
      dividerSmall: {
        height: 2,
        margin: 18,

      },
      dividerLarge: {
        height: 3,
        marginRight: 50,
      },


    liteDivider: {
    borderBottomWidth: 2,
    borderBottomColor: '#E8DFF5',
    borderStyle: 'dashed',  // or 'dotted'

    margin: 10,
    },


  content: {
    fontSize: 16,
    color: '#31154fff',
    lineHeight: 26,
  },
    quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6f538bff',
    lineHeight: 24,
    marginHorizontal: 10,
  },

  reference: {
    fontSize: 12,
    color: '#4b219fff',
    fontWeight: '400',
    textAlign: 'right',},


      jftTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#662cbcff',
    marginTop: 12,
    marginBottom: 6,
  },

});

export default JFTDetailScreen;
