import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ScrollView, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { BlurView } from 'expo-blur';

function LogoMenuModal({ visible, onClose, onNotifications, onChangeTheme }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.logoMenuContainer}>
          <TouchableOpacity style={styles.logoMenuItem} onPress={onNotifications}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <Text style={styles.logoMenuText}>Уведомления</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoMenuItem} onPress={onChangeTheme}>
            <Ionicons name="color-palette-outline" size={24} color="#fff" />
            <Text style={styles.logoMenuText}>Смена темы</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

function FeedScreen({ theme, profile, setTheme }) {
  const navigation = useNavigation();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#000' : '#fff' }}>
      <View style={[styles.header, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff', borderBottomColor: theme === 'dark' ? '#333' : '#eee' }]}>
        <TouchableOpacity onPress={() => setShowThemeMenu(!showThemeMenu)}>
          <Ionicons name="menu-outline" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={[styles.logo, { color: theme === 'dark' ? '#fff' : '#000' }]}>LYN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Профиль')}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: theme === 'dark' ? '#222' : '#eee', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 20 }}>🧑</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {showThemeMenu && (
        <View style={[styles.themeMenu, { backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' }]}>
          <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('light'); setShowThemeMenu(false); }}>
            <Ionicons name="sunny-outline" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
            <Text style={[styles.themeText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Светлая тема</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('dark'); setShowThemeMenu(false); }}>
            <Ionicons name="moon-outline" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
            <Text style={[styles.themeText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Тёмная тема</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.center}>
        <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Лента</Text>
      </View>
      <LogoMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNotifications={() => {
          setMenuVisible(false);
          Alert.alert('Уведомления', 'Скоро здесь будут уведомления');
        }}
        onChangeTheme={() => {
          setMenuVisible(false);
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
      />
    </View>
  );
}

function ChatsScreen({ theme, profile, setTheme }) {
  const navigation = useNavigation();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState([
    { id: '1', name: 'Анна', nick: '@anna', avatar: null, lastMessage: 'Привет! Как дела?', time: '14:23' },
    { id: '2', name: 'Дипсик', nick: '@dipsik', avatar: null, lastMessage: 'Отличная идея с поиском', time: '12:05' },
    { id: '3', name: 'Мама', nick: '@mama', avatar: null, lastMessage: 'Ты сегодня будешь?', time: '09:47' },
    { id: '4', name: 'Костя', nick: '@kostya', avatar: null, lastMessage: 'Скинь код', time: 'вчера' },
    { id: '5', name: 'Максим', nick: '@maxim', avatar: null, lastMessage: 'Погнали', time: 'вчера' },
  ]);

  const filteredChats = chats.filter(chat => chat.nick.toLowerCase().includes(searchQuery.toLowerCase()));

  const openChat = (chat) => {
    navigation.navigate('ChatRoom', {
      chatId: chat.id,
      chatName: chat.name,
      chatNick: chat.nick,
      chatAvatar: chat.avatar,
      chatBio: chat.bio || '',
      chatBanner: chat.banner || null,
      chatPosts: chat.posts || []
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#000' : '#fff' }}>
      <View style={[styles.header, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff', borderBottomColor: theme === 'dark' ? '#333' : '#eee' }]}>
        <TouchableOpacity onPress={() => setShowThemeMenu(!showThemeMenu)}>
          <Ionicons name="menu-outline" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={[styles.logo, { color: theme === 'dark' ? '#fff' : '#000' }]}>LYN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Профиль')}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: theme === 'dark' ? '#222' : '#eee', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 20 }}>🧑</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {showThemeMenu && (
        <View style={[styles.themeMenu, { backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' }]}>
          <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('light'); setShowThemeMenu(false); }}>
            <Ionicons name="sunny-outline" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
            <Text style={[styles.themeText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Светлая тема</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('dark'); setShowThemeMenu(false); }}>
            <Ionicons name="moon-outline" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
            <Text style={[styles.themeText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Тёмная тема</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={theme === 'dark' ? '#888' : '#aaa'} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme === 'dark' ? '#fff' : '#000', borderColor: theme === 'dark' ? '#333' : '#ccc' }]}
          placeholder="Поиск по @username"
          placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItemWrapper} onPress={() => openChat(item)}>
            <View style={[styles.chatAvatar, { backgroundColor: theme === 'dark' ? '#444' : '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 18 }}>🧑</Text>
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={[styles.chatName, { color: theme === 'dark' ? '#fff' : '#000' }]}>{item.name}</Text>
                <Text style={[styles.chatNick, { color: theme === 'dark' ? '#888' : '#aaa' }]}>{item.nick}</Text>
              </View>
              <Text style={[styles.chatLastMessage, { color: theme === 'dark' ? '#aaa' : '#666' }]} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
            <Text style={[styles.chatTime, { color: theme === 'dark' ? '#888' : '#aaa' }]}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
      <LogoMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNotifications={() => {
          setMenuVisible(false);
          Alert.alert('Уведомления', 'Скоро здесь будут уведомления');
        }}
        onChangeTheme={() => {
          setMenuVisible(false);
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
      />
    </View>
  );
}

function LibraryScreen({ theme, profile, setTheme }) {
  const navigation = useNavigation();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#000' : '#fff' }}>
      <View style={[styles.header, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff', borderBottomColor: theme === 'dark' ? '#333' : '#eee' }]}>
        <TouchableOpacity onPress={() => setShowThemeMenu(!showThemeMenu)}>
          <Ionicons name="menu-outline" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={[styles.logo, { color: theme === 'dark' ? '#fff' : '#000' }]}>LYN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Профиль')}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: theme === 'dark' ? '#222' : '#eee', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 20 }}>🧑</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {showThemeMenu && (
        <View style={[styles.themeMenu, { backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' }]}>
          <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('light'); setShowThemeMenu(false); }}>
            <Ionicons name="sunny-outline" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
            <Text style={[styles.themeText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Светлая тема</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('dark'); setShowThemeMenu(false); }}>
            <Ionicons name="moon-outline" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
            <Text style={[styles.themeText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Тёмная тема</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.center}>
        <Text style={{ color: theme === 'dark' ? '#fff' : '#000' }}>Библиотека</Text>
      </View>
      <LogoMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNotifications={() => {
          setMenuVisible(false);
          Alert.alert('Уведомления', 'Скоро здесь будут уведомления');
        }}
        onChangeTheme={() => {
          setMenuVisible(false);
          setTheme(theme === 'dark' ? 'light' : 'dark');
        }}
      />
    </View>
  );
}

function ProfileScreen({ theme, profile, setProfile, setTheme }) {
  const navigation = useNavigation();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [name, setName] = useState(profile.name);
  const [nick, setNick] = useState(profile.nick);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [banner, setBanner] = useState(profile.banner);
  const [bio, setBio] = useState(profile.bio || '');
  const [posts, setPosts] = useState(profile.posts || []);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showBannerMenu, setShowBannerMenu] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [addToLibrary, setAddToLibrary] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const pickImage = async (isBanner = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: isBanner ? [16, 9] : [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      if (isBanner) setBanner(result.assets[0].uri);
      else setAvatar(result.assets[0].uri);
    }
    setShowAvatarMenu(false);
    setShowBannerMenu(false);
  };

  const removeAvatar = () => { setAvatar(null); setShowAvatarMenu(false); };
  const removeBanner = () => { setBanner(null); setShowBannerMenu(false); };

  const createPost = () => {
    if (!newPostText.trim() && !newPostImage) {
      Alert.alert('Ошибка', 'Добавьте текст или фото');
      return;
    }
    const newPost = {
      id: Date.now(),
      text: newPostText,
      image: newPostImage,
      date: new Date().toLocaleString(),
      inLibrary: addToLibrary,
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
    setNewPostImage(null);
    setAddToLibrary(true);
    setShowPostModal(false);
  };

  const saveProfile = () => {
    const newProfile = { name, nick, avatar, banner, bio, posts };
    setProfile(newProfile);
    Alert.alert('Сохранено', 'Профиль обновлён');
  };

  return (
    <ScrollView style={[styles.profileContainer, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff', borderBottomColor: theme === 'dark' ? '#333' : '#eee' }]}>
        <TouchableOpacity onPress={() => setShowThemeMenu(!showThemeMenu)}>
          <Ionicons name="menu-outline" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={[styles.logo, { color: theme === 'dark' ? '#fff' : '#000' }]}>LYN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>
      {showThemeMenu && (
        <View style={[styles.themeMenu, { backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' }]}>
          <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('light'); setShowThemeMenu(false); }}>
            <Ionicons name="sunny-outline" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
            <Text style={[styles.themeText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Светлая тема</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeOption} onPress={() => { setTheme('dark'); setShowThemeMenu(false); }}>
            <Ionicons name="moon-outline" size={24} color={theme === 'dark' ? '#fff' : '#000'} />
            <Text style={[styles.themeText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Тёмная тема</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity onPress={() => setShowBannerMenu(true)}>
        {banner ? <Image source={{ uri: banner }} style={styles.banner} /> : <View style={[styles.banner, { backgroundColor: theme === 'dark' ? '#222' : '#ddd' }]} />}
      </TouchableOpacity>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => setShowAvatarMenu(true)}>
          {avatar ? <Image source={{ uri: avatar }} style={styles.profileAvatar} /> : <View style={[styles.profileAvatar, { backgroundColor: theme === 'dark' ? '#444' : '#ccc', justifyContent: 'center', alignItems: 'center' }]}><Text style={{ fontSize: 40 }}>🧑</Text></View>}
        </TouchableOpacity>
      </View>
      <TextInput style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000', borderColor: theme === 'dark' ? '#333' : '#ccc' }]} placeholder="Имя" placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'} value={name} onChangeText={setName} />
      <TextInput style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000', borderColor: theme === 'dark' ? '#333' : '#ccc' }]} placeholder="Ник" placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'} value={nick} onChangeText={setNick} />
      <TextInput style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000', borderColor: theme === 'dark' ? '#333' : '#ccc', height: 80 }]} placeholder="Описание профиля" placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'} value={bio} onChangeText={setBio} multiline />
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}><Text style={styles.saveButtonText}>Сохранить</Text></TouchableOpacity>
      <View style={styles.divider} />
      <View style={styles.postsHeader}>
        <Text style={[styles.postsTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Посты</Text>
        <TouchableOpacity onPress={() => setShowPostModal(true)}><Ionicons name="add-circle" size={32} color="#007aff" /></TouchableOpacity>
      </View>
      {posts.length === 0 ? (
        <View style={styles.emptyPostsContainer}><Text style={[styles.emptyPostsText, { color: theme === 'dark' ? '#888' : '#aaa' }]}>пока здесь пусто</Text></View>
      ) : (
        posts.map(post => (
          <View key={post.id} style={[styles.postCard, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#f5f5f5' }]}>
            {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
            <Text style={[styles.postText, { color: theme === 'dark' ? '#fff' : '#000' }]}>{post.text}</Text>
            <Text style={[styles.postDate, { color: theme === 'dark' ? '#888' : '#aaa' }]}>{post.date}</Text>
            <View style={styles.libraryBadge}><Text style={{ color: post.inLibrary ? '#007aff' : '#aaa' }}>{post.inLibrary ? '📚 В библиотеке' : '🚫 Не в библиотеке'}</Text></View>
          </View>
        ))
      )}
      <Modal visible={showAvatarMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowAvatarMenu(false)}>
          <View style={[styles.modalMenu, { backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' }]}>
            <TouchableOpacity style={styles.modalItem} onPress={() => pickImage(false)}><Text style={[styles.modalText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Добавить фото</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={removeAvatar}><Text style={[styles.modalText, { color: '#ff3b30' }]}>Удалить фото</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => setShowAvatarMenu(false)}><Text style={[styles.modalText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Отмена</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={showBannerMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowBannerMenu(false)}>
          <View style={[styles.modalMenu, { backgroundColor: theme === 'dark' ? '#2c2c2c' : '#fff' }]}>
            <TouchableOpacity style={styles.modalItem} onPress={() => pickImage(true)}><Text style={[styles.modalText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Добавить банер</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={removeBanner}><Text style={[styles.modalText, { color: '#ff3b30' }]}>Удалить банер</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => setShowBannerMenu(false)}><Text style={[styles.modalText, { color: theme === 'dark' ? '#fff' : '#000' }]}>Отмена</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={showPostModal} animationType="slide">
        <View style={[styles.modalFull, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
          <View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Новый пост</Text><TouchableOpacity onPress={() => setShowPostModal(false)}><Ionicons name="close" size={28} color={theme === 'dark' ? '#fff' : '#000'} /></TouchableOpacity></View>
          <TouchableOpacity style={styles.imagePickerButton} onPress={async () => { const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 }); if (!result.canceled) setNewPostImage(result.assets[0].uri); }}><Text style={styles.imagePickerText}>{newPostImage ? 'Фото выбрано' : 'Добавить фото'}</Text></TouchableOpacity>
          {newPostImage && <Image source={{ uri: newPostImage }} style={styles.previewImage} />}
          <TextInput style={[styles.postInput, { color: theme === 'dark' ? '#fff' : '#000', borderColor: theme === 'dark' ? '#333' : '#ccc' }]} placeholder="Текст поста" placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'} value={newPostText} onChangeText={setNewPostText} multiline />
          <TouchableOpacity style={styles.checkboxRow} onPress={() => setAddToLibrary(!addToLibrary)}><View style={[styles.checkbox, addToLibrary && styles.checkboxChecked]}>{addToLibrary && <Ionicons name="checkmark" size={16} color="#fff" />}</View><Text style={[styles.checkboxLabel, { color: theme === 'dark' ? '#fff' : '#000' }]}>Библиотека</Text></TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={createPost}><Text style={styles.createButtonText}>Опубликовать</Text></TouchableOpacity>
        </View>
      </Modal>
      <LogoMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNotifications={() => { setMenuVisible(false); Alert.alert('Уведомления', 'Скоро здесь будут уведомления'); }}
        onChangeTheme={() => { setMenuVisible(false); setTheme(theme === 'dark' ? 'light' : 'dark'); }}
      />
    </ScrollView>
  );
}

function OtherProfileScreen({ route, theme }) {
  const { userId, name, nick, avatar, banner, bio, posts } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView style={[styles.profileContainer, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <View style={[styles.header, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff', borderBottomColor: theme === 'dark' ? '#333' : '#eee' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
  <Ionicons name="arrow-back" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
</TouchableOpacity>
        <Text style={[styles.logo, { color: theme === 'dark' ? '#fff' : '#000' }]}>Профиль</Text>
        <View style={{ width: 28 }} />
      </View>

      {banner ? (
        <Image source={{ uri: banner }} style={styles.banner} />
      ) : (
        <View style={[styles.banner, { backgroundColor: theme === 'dark' ? '#222' : '#ddd' }]} />
      )}

      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.profileAvatar} />
        ) : (
          <View style={[styles.profileAvatar, { backgroundColor: theme === 'dark' ? '#444' : '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 40 }}>🧑</Text>
          </View>
        )}
      </View>

      <Text style={[styles.otherName, { color: theme === 'dark' ? '#fff' : '#000', textAlign: 'center', marginTop: 60 }]}>{name}</Text>
      <Text style={[styles.otherNick, { color: theme === 'dark' ? '#888' : '#aaa', textAlign: 'center' }]}>{nick}</Text>
      {bio ? <Text style={[styles.otherBio, { color: theme === 'dark' ? '#aaa' : '#666', textAlign: 'center', marginHorizontal: 20, marginTop: 10 }]}>{bio}</Text> : null}

      <View style={styles.divider} />

      <View style={styles.postsHeader}>
        <Text style={[styles.postsTitle, { color: theme === 'dark' ? '#fff' : '#000' }]}>Посты</Text>
      </View>

      {posts && posts.length === 0 ? (
        <View style={styles.emptyPostsContainer}>
          <Text style={[styles.emptyPostsText, { color: theme === 'dark' ? '#888' : '#aaa' }]}>пока здесь пусто</Text>
        </View>
      ) : (
        posts && posts.map(post => (
          <View key={post.id} style={[styles.postCard, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#f5f5f5' }]}>
            {post.image && <Image source={{ uri: post.image }} style={styles.postImage} />}
            <Text style={[styles.postText, { color: theme === 'dark' ? '#fff' : '#000' }]}>{post.text}</Text>
            <Text style={[styles.postDate, { color: theme === 'dark' ? '#888' : '#aaa' }]}>{post.date}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function ChatRoomScreen({ route, theme }) {
  const { chatId, chatName, chatNick, chatAvatar, chatBio, chatBanner, chatPosts } = route.params;
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Скрываем нижний таб-бар
  useEffect(() => {
    const parent = navigation.getParent();
    if (parent) {
      parent.setOptions({
        tabBarStyle: { display: 'none' }
      });
    }
    return () => {
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'flex' }
        });
      }
    };
  }, [navigation]);

  // Загрузка сообщений
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const saved = await AsyncStorage.getItem(`chat_${chatId}`);
        if (saved) setMessages(JSON.parse(saved));
      } catch (e) {}
    };
    loadMessages();
  }, [chatId]);

  // Сохранение сообщений
  useEffect(() => {
    AsyncStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputText.trim(),
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  // Переход в чужой профиль (только одна функция)
  const openOtherProfile = () => {
    navigation.navigate('OtherProfile', {
      userId: chatId,
      name: chatName,
      nick: chatNick,
      avatar: chatAvatar,
      banner: chatBanner,
      bio: chatBio,
      posts: chatPosts || []
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#000' : '#fff' }}>
      <View style={[styles.chatRoomHeader, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff', borderBottomColor: theme === 'dark' ? '#333' : '#eee' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color={theme === 'dark' ? '#fff' : '#000'} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.chatRoomUserInfo} onPress={openOtherProfile}>
          {chatAvatar ? (
            <Image source={{ uri: chatAvatar }} style={styles.chatRoomAvatar} />
          ) : (
            <View style={[styles.chatRoomAvatar, { backgroundColor: theme === 'dark' ? '#444' : '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ fontSize: 20 }}>🧑</Text>
            </View>
          )}
          <View style={styles.chatRoomNameContainer}>
            <Text style={[styles.chatRoomName, { color: theme === 'dark' ? '#fff' : '#000' }]}>{chatName}</Text>
            <Text style={[styles.chatRoomNick, { color: theme === 'dark' ? '#888' : '#aaa' }]}>{chatNick}</Text>
          </View>
        </TouchableOpacity>
        
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageRow, item.sender === 'me' ? styles.myMessageRow : styles.theirMessageRow]}>
            <View style={[styles.messageBubble, item.sender === 'me' ? styles.myBubble : styles.theirBubble]}>
              <Text style={[styles.messageText, { color: item.sender === 'me' ? '#fff' : (theme === 'dark' ? '#fff' : '#000') }]}>{item.text}</Text>
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={[styles.inputContainer, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff', borderTopColor: theme === 'dark' ? '#333' : '#eee' }]}>
        <TextInput
          style={[styles.input, { color: theme === 'dark' ? '#fff' : '#000', backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5' }]}
          placeholder="Сообщение..."
          placeholderTextColor={theme === 'dark' ? '#888' : '#aaa'}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#007aff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation, theme }) {
  return (
    <View style={[styles.customTabBar, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#ffffff' }]}>
      <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Лента')}>
        <Ionicons name={state.index === 0 ? 'newspaper' : 'newspaper-outline'} size={30} color={state.index === 0 ? '#007aff' : (theme === 'dark' ? '#888' : '#aaa')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Чаты')}>
        <Ionicons name={state.index === 1 ? 'chatbubbles' : 'chatbubbles-outline'} size={30} color={state.index === 1 ? '#007aff' : (theme === 'dark' ? '#888' : '#aaa')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate('Библиотека')}>
        <Ionicons name={state.index === 2 ? 'bookmark' : 'bookmark-outline'} size={30} color={state.index === 2 ? '#007aff' : (theme === 'dark' ? '#888' : '#aaa')} />
      </TouchableOpacity>
    </View>
  );
}

function MainApp() {
  const [theme, setTheme] = useState('dark');
  const [profile, setProfile] = useState({ name: 'Пользователь', nick: '@user', avatar: null, banner: null, bio: '', posts: [] });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const saved = await AsyncStorage.getItem('profile');
        if (saved) setProfile(JSON.parse(saved));
      } catch (e) {}
    };
    loadProfile();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => {
  const routeName = props.state.routes[props.state.index].name;
  if (routeName === 'Профиль' || routeName === 'ChatRoom' || routeName === 'OtherProfile') return null;
  return <CustomTabBar {...props} theme={theme} />;
}}
        screenOptions={{ headerShown: false }}
        initialRouteName="Лента"
      >
        <Tab.Screen name="Лента">{(props) => <FeedScreen {...props} theme={theme} profile={profile} setTheme={setTheme} />}</Tab.Screen>
        <Tab.Screen name="Чаты">{(props) => <ChatsScreen {...props} theme={theme} profile={profile} setTheme={setTheme} />}</Tab.Screen>
        <Tab.Screen name="Библиотека">{(props) => <LibraryScreen {...props} theme={theme} profile={profile} setTheme={setTheme} />}</Tab.Screen>
        <Tab.Screen name="Профиль">{(props) => <ProfileScreen {...props} theme={theme} profile={profile} setProfile={setProfile} setTheme={setTheme} />}</Tab.Screen>
        
        <Tab.Screen 
          name="ChatRoom" 
          component={ChatRoomScreen} 
          options={{ 
            tabBarButton: () => null, 
            headerShown: false,
            tabBarStyle: { display: 'none' }
          }} 
        />
        
        <Tab.Screen 
          name="OtherProfile" 
          component={OtherProfileScreen} 
          options={{ 
            tabBarButton: () => null, 
            headerShown: false,
            tabBarStyle: { display: 'none' }
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() { return <MainApp />; }

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  customTabBar: { position: 'absolute', bottom: 20, alignSelf: 'center', width: 220, height: 60, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  tabButton: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#333' },
  logo: { fontSize: 20, fontWeight: 'bold' },
  avatar: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' },
  themeMenu: { position: 'absolute', top: 100, alignSelf: 'center', width: 200, padding: 12, borderRadius: 12, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, zIndex: 1000 },
  themeOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, gap: 12 },
  themeText: { fontSize: 16 },
  profileContainer: { flex: 1 },
  banner: { width: '100%', height: 150, backgroundColor: '#ccc' },
  avatarContainer: { position: 'absolute', top: 170, left: 20, width: '100%', alignItems: 'flex-start', marginTop: -50 },
  profileAvatar: { width: 90, height: 90, borderRadius: 50 },
  input: { width: '90%', borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, marginTop: 20, alignSelf: 'center' },
  saveButton: { backgroundColor: '#007aff', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 10, marginTop: 20, alignSelf: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#333', marginVertical: 20, marginHorizontal: 16 },
  postsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  postsTitle: { fontSize: 20, fontWeight: 'bold' },
  emptyPostsContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyPostsText: { fontSize: 16 },
  postCard: { margin: 10, padding: 15, borderRadius: 12 },
  postImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10 },
  postText: { fontSize: 14, marginBottom: 8 },
  postDate: { fontSize: 10 },
  libraryBadge: { marginTop: 8, alignItems: 'flex-start' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalMenu: { width: 250, borderRadius: 12, padding: 10 },
  modalItem: { padding: 15, alignItems: 'center' },
  modalText: { fontSize: 16 },
  modalFull: { flex: 1, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  imagePickerButton: { backgroundColor: '#007aff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  imagePickerText: { color: '#fff', fontSize: 16 },
  previewImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 15 },
  postInput: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, minHeight: 100, marginBottom: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#007aff', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#007aff' },
  checkboxLabel: { fontSize: 16 },
  createButton: { backgroundColor: '#007aff', padding: 15, borderRadius: 10, alignItems: 'center' },
  createButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  logoMenuContainer: { position: 'absolute', top: '40%', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: 16, padding: 16, width: 250 },
  logoMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, gap: 12 },
  logoMenuText: { color: '#fff', fontSize: 18 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#333' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 40, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, fontSize: 16 },
  chatItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#333', alignItems: 'center' },
  chatAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 16, fontWeight: 'bold' },
  chatNick: { fontSize: 14 },
  chatLastMessage: { fontSize: 14 },
  chatTime: { fontSize: 12 },
  chatHeaderTitle: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  chatHeaderNick: { fontSize: 14, marginLeft: 8 },
  messageRow: { marginVertical: 5 },
  myMessageRow: { alignItems: 'flex-end' },
  theirMessageRow: { alignItems: 'flex-start' },
  messageBubble: { maxWidth: '80%', padding: 10, borderRadius: 15 },
  myBubble: { backgroundColor: '#007aff' },
  theirBubble: { backgroundColor: '#e5e5e5' },
  messageText: { fontSize: 16 },
  messageTime: { fontSize: 10, color: '#aaa', textAlign: 'right', marginTop: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
  sendButton: { padding: 8 },
  otherName: { fontSize: 24, fontWeight: 'bold', marginTop: 60 },
  otherNick: { fontSize: 16, marginTop: 4 },
  otherBio: { fontSize: 14, marginTop: 8 },
  chatItemWrapper: {
  flexDirection: 'row',
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#333',
  alignItems: 'center',
  chatRoomHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingTop: 50,
  paddingBottom: 10,
  borderBottomWidth: 1,
},
chatRoomUserInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  marginLeft: 12,
},
chatRoomAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 12,
},
chatRoomNameContainer: {
  flex: 1,
},
chatRoomName: {
  fontSize: 16,
  fontWeight: 'bold',
},
chatRoomNick: {
  fontSize: 14,
},
},
});