import { useState, useEffect } from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBox} from '../src/components/ProfileRelations'

function ProfileSidebar(props) {
  const { githubUser } = props

  return (
    <Box as="aside"> 
      <img src={`https://github.com/${githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${githubUser}`}>
          @{githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}




export default function Home() {

  const githubUser = 'ghonoratos'
  const [following, setFollowing] = useState([])
  const [communities, setCommunities] = useState([]);
  const [followers, setFollowers] = useState([])


  async function createNewCommunity(newCommunity){
    const fetchData = fetch('/api/communities',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCommunity)
    })
  
    return fetchData
  }

  async function handleCreateCommunity(e) {
    e.preventDefault();
    const { title, image } = e.target;
    const newCommunity = {
      title: title.value,
      imageUrl: image.value,
      creatorSlug: githubUser
    }

    const response = await createNewCommunity(newCommunity);
    const data = await response.json();
    const { community } = data;

    console.log(community)

    setCommunities((oldCommunities) => [...oldCommunities, community])
  }

  async function fetchFollowers(){
    const response = await fetch('https://api.github.com/users/omariosouto/followers')
    const data = await response.json()
    const follower = data.map(({ id, login, avatar_url }) => ({ 
      id: id,
      title: login,
      image: avatar_url }
    ))

    return follower;
  } 

  async function fetchFollowing(){
    const response = await fetch('https://api.github.com/users/omariosouto/following')
    const data = await response.json()
    const following = data.map(({ id, login, avatar_url }) => ({ 
      id: id,
      title: login,
      image: avatar_url }
    ))

    return following;
  } 

  async function fetchCommunities(){
    const response = await fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '467072c1706f3d9a4e78a492547a07',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(
        {"query": `query {
          allCommunities{
            id,
            title,
            imageUrl,
            creatorSlug
          }
        }`
       }
      )
    })
    const allData = await response.json()
    const communities = allData.data.allCommunities;

    const community = communities.map(({ id, title, imageUrl}) => ({ 
      id: id,
      title: title,
      image: imageUrl }
    ))

    return community;
  } 

  useEffect(() => {
    async function getInfos(){
      setFollowers(await fetchFollowers())
      setFollowing(await fetchFollowing())
      setCommunities(await fetchCommunities())
    }
    
    getInfos();
    
  }, [])

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid> 

        <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1> 

            <OrkutNostalgicIconSet 
              mensagens="8" 
              videos="5" 
              fotos="3" 
              recados="15" 
              fas="18"
              confiavel="3"
              legal="2"
              sexy="0"
            />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={handleCreateCommunity}>

              <div>
                <input 
                  placeholder="Qual vai ser o nome da sua comunidade?" 
                  type="text" 
                  name="title" 
                  aria-label="Qual vai ser o nome da sua comunidade?"
                />
              </div>

              <div>
                <input 
                  placeholder="URL da capa" 
                  type="text" 
                  name="image" 
                  aria-label="URL da capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>

            </form>
          </Box>

        </div>

        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
          <ProfileRelationsBox title="Comunidades" data={communities} url="communities" />
          <ProfileRelationsBox title="Seguidores" data={followers} url="users"/>
          <ProfileRelationsBox title="Pessoas da comunidade" data={following} url="users" />
        </div>
      </MainGrid> 
    </>
  ) 
}
