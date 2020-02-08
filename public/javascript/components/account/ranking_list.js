class Top_Ranker_List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rankingList: rankingList
        };
    }
    topRankerList = () => {
        var list = []
        var rank_list = []
        rank_list = this.state.rankingList

        var data = rank_list[1]
        var count = ["2", "1", "3"]
        rank_list[1] = rank_list[0]
        rank_list[0] = data
        for (var i = 0; i < 3; i++) {
            var tagList = []
            var score=parseFloat(rank_list[i].score).toFixed(2)
            for (var j = 0; j < rank_list[i].prefertags.length; j++) {
                var tag = rank_list[i].prefertags[j].tagName
                var tag_code;
                var tagName
                if (tag == "spring") {
                    tag_code = "tag_spring"
                    tagName = "봄"
                } else if (tag == "summer") {
                    tag_code = "tag_summer"
                    tagName = "여름"
                } else if (tag == "fall") {
                    tag_code = "tag_fall"
                    tagName = "가을"
                } else if (tag == "winter") {
                    tag_code = "tag_winter"
                    tagName = "겨울"
                } else if (tag == "cute") {
                    tag_code = "tag_cute"
                    tagName = "큐트"
                } else if (tag == "brilliant") {
                    tag_code = "tag_brilliant"
                    tagName = "화려"
                } else if (tag == "luxury") {
                    tag_code = "tag_luxury"
                    tagName = "우아"
                } else if (tag == "simple") {
                    tag_code = "tag_simple"
                    tagName = "심플"
                }
                tagList.push(<span className={tag_code}>{tagName}</span>)
            }
            if (i == 1) {
                list.push(
                    <div className="ranker">
                        <h3>{count[i]}위</h3>
                        <img src={rank_list[i].thumbnail} alt="" className="top1" />
                        <p className="userName">{rank_list[i].name}</p>
                        <div className="tagBox">
                            선호태그 :
                            {tagList}
                        </div>
                        Score : {score}
                    </div>
                )
            } else {
                list.push(
                    <div className="ranker">
                        <h4>{count[i]}위</h4>
                        <img src={rank_list[i].thumbnail} alt="" className="top" />
                        <p className="userName">{rank_list[i].name}</p>
                        <div className="tagBox">
                            선호태그 :
                            {tagList}
                        </div>
                        Score : {score}
                    </div>
                );
            }
        }
        return list;
    }

    rankerLsit = () => {
        var list = []
        var rank_list = []
        rank_list = this.state.rankingList
        for (var i = 3; i < rank_list.length; i++) {
            var tagList = []
            for (var j = 0; j < rank_list[i].prefertags.length; j++) {
                var tag = rank_list[i].prefertags[j].tagName
                var tag_code;
                var tagName
                if (tag == "spring") {
                    tag_code = "tag_spring"
                    tagName = "봄"
                } else if (tag == "summer") {
                    tag_code = "tag_summer"
                    tagName = "여름"
                } else if (tag == "fall") {
                    tag_code = "tag_fall"
                    tagName = "가을"
                } else if (tag == "winter") {
                    tag_code = "tag_winter"
                    tagName = "겨울"
                } else if (tag == "cute") {
                    tag_code = "tag_cute"
                    tagName = "큐트"
                } else if (tag == "brilliant") {
                    tag_code = "tag_brilliant"
                    tagName = "화려"
                } else if (tag == "luxury") {
                    tag_code = "tag_luxury"
                    tagName = "우아"
                } else if (tag == "simple") {
                    tag_code = "tag_simple"
                    tagName = "심플"
                }
                tagList.push(<span className={tag_code}>{tagName}</span>)
            }
            list.push(
                <tbody>
                    <tr>
                        <td className="rankingNo">{i}</td>
                        <td className="rankingName">
                            <div className="pro_img">
                                <a href='' className="">
                                    <img name="thumbnail" src={rank_list[i].thumbnail} />
                                </a>
                            </div>
                        </td>
                        <td>{rank_list[i].name}</td>
                        <td>{rank_list[i].score}</td>
                        <td> 
                            <div className="tagBox">
                                {tagList}
                            </div>
                        </td>
                    </tr>
                </tbody>
            )
        }
        return list;
    }
    render() {
        return (
            <div>
                <div className="ranker_box">
                    <h2>판매 랭킹 Top 3</h2>
                    <div className="top3_ranker_box">
                        {this.topRankerList()}
                    </div>
                </div>
                <div className="ranker_list_box">
                    <table className="ranking_table">
                        {this.rankerLsit()}
                    </table>
                </div>
            </div>

        )
    }
}

ReactDOM.render(<Top_Ranker_List />, document.getElementById('ranking_box')); 