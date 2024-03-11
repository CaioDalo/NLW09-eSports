import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TouchableOpacity, View, Image, FlatList, Text } from "react-native";
import { GameParams } from "../../@types/navigation";
import { Entypo } from "@expo/vector-icons";
import { THEME } from "../../theme";

import { Background } from "../../components/Background";
import logoImg from "../../assets/logo-nlw-esports.png";

import { styles } from "./styles";
import { Heading } from "../../components/Heading";
import { DuoCard, Ads } from "../../components/DuoCard";
import { DuoMatch } from "../../components/DuoMatch";

export function Game() {
  const [ads, setAds] = useState<Ads[]>([]);
  const [discordDuoSelected, setdiscordDuoSelected] = useState<string>("");

  const navigation = useNavigation();
  const route = useRoute();
  const game = route.params as GameParams;

  function handleGoBack() {
    navigation.goBack();
  }

  const getDiscordUser = async (adsId: string) => {
    fetch(`http://192.168.3.3:3333/ads/${adsId}/discord`)
      .then((response) => response.json())
      .then((data) => setdiscordDuoSelected(data.discord));
  };

  useEffect(() => {
    fetch(`http://192.168.3.3:3333/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => setAds(data));
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              size={24}
              color={THEME.COLORS.CAPTION_300}
            />
          </TouchableOpacity>

          <Image source={logoImg} style={styles.logo} />
          <View style={styles.right} />
        </View>

        <Image
          style={styles.cover}
          source={{ uri: game.bannerUrl }}
          resizeMode="cover"
        />

        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />

        <FlatList
          data={ads}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item} onConnect={() => getDiscordUser(item.id)} />
          )}
          horizontal
          style={styles.containerList}
          contentContainerStyle={ads.length ? styles.contentList : styles.empty}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicados ainda
            </Text>
          )}
        />

        <DuoMatch
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={() => setdiscordDuoSelected("")}
        />
      </SafeAreaView>
    </Background>
  );
}
