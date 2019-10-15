import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  ScrollView,
  Dimensions,
  Linking,
  //Button,
  View,
  TouchableOpacity,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Collapsible from 'react-native-collapsible';


// galio components
import {
  Block, Card, Text, Icon, NavBar, Button
} from 'galio-framework';
import theme from './theme';

const data = [
  {
    title: "Lisboa", content: 'asda asd asd asdasd ', // <Button title='NOS Cinemas Alvaláxia - Lisboa' onPress={() => Linking.openURL('https://www.sapo.pt')} />,
  },
  { title: "Grande Lisboa - Norte", content: "Lorem ipsum dolor sit amet" },
  { title: "Margem Sul do Tejo", content: "Lorem ipsum dolor sit amet" },
  { title: "Porto", content: "Lorem ipsum dolor sit amet" },
  { title: "Grande Porto", content: "Lorem ipsum dolor sit amet" }
];

const { width, height } = Dimensions.get('screen');

const fill = 78;
const bgImage = 'https://image.tmdb.org/t/p/w1280/kKTPv9LKKs5L3oO1y5FNObxAPWI.jpg';

const Article = props => (
  <Block style={{height}}>
    <StatusBar barStyle="light-content" />
    <Block style={styles.navbar}>
      <NavBar transparent leftIconColor={theme.COLORS.WHITE} onLeftPress={() => undefined} />
    </Block>

    <Image
      source={{ uri: bgImage }}
      resizeMode="cover"
      style={{
        width,
        height: height * 0.35,
      }}
    />

    <TouchableOpacity
      onPress={() => Linking.openURL('https://www.youtube.com/embed/ELeMaP8EPAA')}
      style={{
        position: 'absolute',
        top: 130,
        left: '40%',
      }}
    >
      <Icon
        name="play-circle"
        family="font-awesome"
        color="#F5C518"
        size={theme.SIZES.FONT * 4}
        style={{
          shadowColor: 'black',
          shadowOpacity: 0.5,
          shadowRadius: 5,
          shadowOffset: {
            width: 0,
            height: 1,
          },
        }}
      />
    </TouchableOpacity>

    <Block center style={{ marginTop: -theme.SIZES.BASE * 2 }}>
      <Block flex style={styles.header}>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            position: 'absolute',
            top: 33,
            right: '7%',
          }}
        >
          {/*<Icon
            name="ellipsis-v"
            family="font-awesome"
            color="#333"
            size={theme.SIZES.FONT * 1.4}
            style={{
              shadowColor: 'black',
              shadowOpacity: 0.5,
              shadowRadius: 5,
              shadowOffset: {
                width: 0,
                height: 1,
              },
            }}
          /> */}
          <Button onlyIcon icon="ellipsis-v" iconFamily="font-awesome" size={theme.SIZES.FONT * 1.4} iconColor="#333" color="#eee" style={{ width: 30, height: 30 }}></Button>
        </TouchableOpacity>
        <Block style={{ width: '85%'}}>
          <Text size={theme.SIZES.BASE * 1.4}>Era Uma Vez em... Hollywood</Text>
          <Text muted t size={theme.SIZES.BASE * 0.875} style={{ marginBottom: theme.SIZES.BASE, fontWeight: '400', width: '100%' }}>
            Once Upon a Time... in Hollywood
          </Text>
        </Block>

        {/*<Block center>
          <Card
            borderless
            style={styles.stats}
            title="Christopher Moon"
            caption="139 minutes ago"
            avatar="http://i.pravatar.cc/100?id=article"
            location={(
              <Block row right>
                <Block row middle style={{ marginHorizontal: theme.SIZES.BASE }}>
                  <Icon name="eye" family="font-awesome" color={theme.COLORS.MUTED} size={theme.SIZES.FONT * 0.875} />
                  <Text
                    p
                    color={theme.COLORS.MUTED}
                    size={theme.SIZES.FONT * 0.875}
                    style={{ marginLeft: theme.SIZES.BASE * 0.25 }}
                  >
                    25.6k
                  </Text>
                </Block>
                <Block row middle>
                  <Icon name="heart" family="font-awesome" color={theme.COLORS.MUTED} size={theme.SIZES.FONT * 0.875} />
                  <Text
                    p
                    color={theme.COLORS.MUTED}
                    size={theme.SIZES.FONT * 0.875}
                    style={{ marginLeft: theme.SIZES.BASE * 0.25 }}
                  >
                    936
                  </Text>
                </Block>
              </Block>
            )}
          />
        </Block> */}

        <Block row style={{ marginBottom: 10, width: '100%'}}>
         <Block row left style={{width: '20%'}}>
            {/* <Icon name="heart" family="font-awesome" color={theme.COLORS.MUTED} size={theme.SIZES.FONT * 2.5} />
          <Text
            p
            color={theme.COLORS.MUTED}
            size={theme.SIZES.FONT * 2}
            style={{ marginLeft: theme.SIZES.BASE * 0.25 }}
          >
            76%
                  </Text>*/}
            <AnimatedCircularProgress
              size={50}
              width={8}
              backgroundWidth={5}
              fill={fill}
              tintColor="#00ff00"
              tintColorSecondary="#ff0000"
              backgroundColor="#3d5875"
              arcSweepAngle={240}
              rotation={240}
              lineCap="round"
            >
              {cFill => <Text style={{
                fontWeight: '500',
                fontSize: 14, // 10 for 3 chars
                width: '100%',
                marginLeft: 3, // 5 for 3 chars
                justifyContent: 'center',
              }}>
               {cFill === fill ? `${cFill}%` : ''}
              </Text>}
            </AnimatedCircularProgress>
          </Block>

          <Block>
            <Icon
              name="imdb"
              family="font-awesome"
              color="#F5C518"
              size={theme.SIZES.FONT * 2.7}
            />
          </Block>
          <Block row style={{width: '30%', marginTop: 4}}>
              <TouchableOpacity
                onPress={() => { }}
              >
                <Text style={{
                  backgroundColor: 'grey',
                  color: 'white',
                  padding: 9,
                  marginLeft: 20,
                  borderRadius: 5,
                }}>Drama</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { }}
              >
              <Text style={{
                backgroundColor: 'grey',
                color: 'white',
                padding: 9,
                marginLeft: 5,
                borderRadius: 5,
              }}>Comédia</Text>
              </TouchableOpacity>
          </Block>
        </Block>


        <Block style={{ height: 100 }}>
        <ScrollView>
          <Text style={styles.text}>
            Um ator de televisão desbotado e seu dublê se esforçam para alcançar fama e sucesso na indústria cinematográfica durante os últimos anos da Era de Ouro de Hollywood, em 1969, em Los Angeles.
          </Text>
        </ScrollView>
        </Block>

        <Block style={{ height: 200 }}>

          <Text style={{ marginBottom: 10 }}>
            Em Exibição:
          </Text>
          <Block row>
            <Block left style={{ width: '95%' }}>
              <Text style={{ fontWeight: '800', width: '100%'}}>
                LISBOA
              </Text>
            </Block>
            <Block right style={{ justifyContent: 'center' }}>
              <Icon name="sort-up" family="font-awesome" color={theme.COLORS.MUTED} size={theme.SIZES.FONT * 0.875} />
            </Block>
          </Block>
          <Collapsible collapsed={false}>
            <View>
              <View style={{ paddingBottom: 5 }}>
                <Button color="#50C7C7" shadowless onPress={() => Linking.openURL('https://www.sapo.pt')} >NOS Cinemas Alvaláxia - Lisboa</Button>
              </View>
              <View style={{ paddingBottom: 5 }}>
                <Button color="#50C7C7" shadowless onPress={() => Linking.openURL('https://www.sapo.pt')} >NOS Cinemas Amoreiras - Lisboa</Button>
              </View>
              <View style={{ paddingBottom: 5 }}>
                <Button color="#50C7C7" shadowless onPress={() => Linking.openURL('https://www.sapo.pt')} >NOS Cinemas Colombo - Lisboa</Button>
              </View>
              <View style={{ paddingBottom: 5 }}>
                <Button color="#50C7C7" shadowless onPress={() => Linking.openURL('https://www.sapo.pt')} >UCI Cinemas El Corte Inglés - Lisboa</Button>
              </View>
            </View>
          </Collapsible>
        </Block>
        {/*<Accordion dataArray={data} />*/}
      </Block>
    </Block>
  </Block>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.COLORS.WHITE,
    borderTopLeftRadius: theme.SIZES.BASE * 2,
    borderTopRightRadius: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE * 1.5,
    width,
  },
  navbar: {
    // top: Constants.statusBarHeight,
    left: 0,
    right: 0,
    zIndex: 9999,
    position: 'absolute',
  },
  stats: {
    borderWidth: 0,
    width: width - theme.SIZES.BASE * 2,
    height: theme.SIZES.BASE * 3,
    marginVertical: theme.SIZES.BASE * 0.875,
  },
  title: {
    justifyContent: 'center',
    paddingLeft: theme.SIZES.BASE / 2,
  },
  avatar: {
    width: theme.SIZES.BASE * 2.5,
    height: theme.SIZES.BASE * 2.5,
    borderRadius: theme.SIZES.BASE * 1.25,
  },
  middle: {
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.SIZES.FONT * 0.875,
    lineHeight: theme.SIZES.FONT * 1.25,
  },
});

export default Article;
