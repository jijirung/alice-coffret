class WriteButton extends React.Component {
    render() {
        var btnStyle = {
            float: 'right',
            margin: "0 0 20px 0",
            color: "white",
        }
        return (
            <div>
                <a href="/sale_post" style={btnStyle} className="btn1">판매글 작성</a>
            </div>
        )
    }
}
class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            all_list: all_list,
            earring_list: earring_list,
            ring_list: ring_list,
        };
    }

    createList = () => {
        var category = ["All", "Earring", "Ring"];
        let itemList = [];
        //style 변수
        var textColor = {
            color: '#ff5675'
        }
        var clear = {
            clear: "both"
        }
        console.log('1')
        //카테고리별 데이터 저장
        for (var k = 0; k < category.length; k++) {
            var item = []
            var list = [];
            if (category[k] == "All") {
                list = this.state.all_list;
            }
            else if (category[k] == "Earring") {
                list = this.state.earring_list
            } else if (category[k] == "Ring") {
                list = this.state.ring_list
            }
            for (var i = 0; i < list.length; i++) {
                var tagList = []
                for (var j = 0; j < list[i].tag.length; j++) {
                    var tag = list[i].tag[j]
                    var tag_code;
                    if (tag == "봄") {
                        tag_code = "tag_spring"
                    } else if (tag == "여름") {
                        tag_code = "tag_summer"
                    } else if (tag == "가을") {
                        tag_code = "tag_fall"
                    } else if (tag == "겨울") {
                        tag_code = "tag_winter"
                    } else if (tag == "큐트") {
                        tag_code = "tag_cute"
                    } else if (tag == "화려") {
                        tag_code = "tag_brilliant"
                    } else if (tag == "우아") {
                        tag_code = "tag_luxury"
                    } else if (tag == "심플") {
                        tag_code = "tag_simple"
                    }
                    tagList.push(<span className={tag_code}>{list[i].tag[j]}</span>)
                }
                var location = '/product/detail/' + list[i]._id
                //글 한개
                item.push(
                    <article id="" className="location-listing">
                        <div className="location-image">
                            <a href={location} className="portfolio-link" data-toggle="modal">
                                <img src={list[i].thumbnail} />
                            </a>
                        </div>
                        <div className="portfolio-caption">
                            <h4 style={textColor}>{list[i].product_name}</h4>
                            <p className="text-muted">
                                {list[i].name}
                            </p>
                        </div>
                        <div className="tag_box">
                            {tagList}
                        </div>
                    </article>
                );
                console.log(item.length + "   " + category[k])
            }
            itemList.push(
                <div className="tab_container" style={clear}>
                    <div id={category[k]} className="tab_content">
                        <div className="grid-container">
                            {item}
                        </div>
                    </div>
                </div>
            );
        }
        return itemList
    }
    render() {
        console.log('4')
        var category = ["All", "Earring", "Piercing", "Ring", "Wristband", "Necklace", "Choker", "Clock", "Brooch", "Hairclip"];
        return (
            <div>

                <div className="tabs_box">
                    <ul className="tabs">
                        <li className="active" rel={category[0]} name={category[0]}>전체</li>
                        <li rel={category[1]} name={category[1]}>귀걸이</li>
                        <li rel={category[2]} name={category[2]}>피어싱</li>
                        <li rel={category[3]} name={category[3]}>반지</li>
                        <li rel={category[4]} name={category[4]}>팔찌</li>
                        <li rel={category[5]} name={category[5]}>목걸이</li>
                        <li rel={category[6]} name={category[6]}>초커</li>
                        <li rel={category[7]} name={category[7]}>시계</li>
                        <li rel={category[8]} name={category[8]}>브로치</li>
                        <li rel={category[9]} name={category[9]}>머리핀</li>
                    </ul>
                </div>
                <div className="child-page-listing">
                    <h2></h2>
                    <WriteButton></WriteButton>
                    <div>
                        {this.createList()}
                    </div>
                </div>
            </div>
        )
    }
}
ReactDOM.render(<List />, document.getElementById('list_box')); 

$( document ).ready(function() {
    $(".tab_content").hide();
    $(".tab_content:first").show();
    $(".child-page-listing h2").text($("ul.tabs li").attr('name'))
    $("ul.tabs li").click(function () {
        var tagName = $(this).attr('name')
        $(".child-page-listing h2").text(tagName)
        $("ul.tabs li").removeClass("active").css("color", "#333");
        //$(this).addClass("active").css({"color": "darkred","font-weight": "bolder"});
        $(this).addClass("active").css("color", "#fff");
        $(".tab_content").hide()
        var activeTab = $(this).attr("rel");
        $("#" + activeTab).fadeIn()
    });
});