import { ProfileRelationsBoxWrapper } from './ProfileRelationsBoxWrapper'

export function ProfileRelationsBox({title, data, url}) {
    return(
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          {title} ({data.length})
        </h2>
        {<ul>
        {data.slice(0,6).map(({id, title, image}) => {
          return (
            <li key={id}>
              <a href={`/${url}/${title}`}>
                  <img src={image} />
                  <span>{title}</span>
                </a>
            </li>
          )
        })}
        </ul>}
      </ProfileRelationsBoxWrapper>
    )
  }