class WriteButton extends React.Component{
    render(){
        return(
            <div className="designbtn">
                <a href="/design/design_create" className="myButton">펀딩 작성</a>
            </div>
        );
    }
}
class List extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            posts: posts,
            earringCheck: false,
            piercingCheck: false,
            ringCheck: false,
            wristbandCheck: false,
            necklacetCheck: false,
            chokerCheck: false,
            clockCheck: false,
            broochCheck: false,
            hairclipCheck: false,
        };
        this.findPosts = this.findPosts.bind(this);
        this.findByTitle = this.findByTitle.bind(this);
        this.findByEarring = this.findByEarring.bind(this);
        this.findByPiercing = this.findByPiercing.bind(this);
        this.findByRing = this.findByRing.bind(this);
        this.findByWristband = this.findByWristband.bind(this);
        this.findByNecklace = this.findByNecklace.bind(this);
        this.findByChoker = this.findByChoker.bind(this);
        this.findByClock = this.findByClock.bind(this);
        this.findByBrooch = this.findByBrooch.bind(this);
        this.findByHairclip = this.findByHairclip.bind(this);
    }

    findPosts(){
        console.log(this.search.value);
        axios.post('/design/find', {
            title: this.search.value,
            earringCheck: this.state.earringCheck,
            piercingCheck: this.state.piercingCheck,
            ringCheck: this.state.ringCheck,
            wristbandCheck: this.state.wristbandCheck,
            necklacetCheck: this.state.necklacetCheck,
            chokerCheck: this.state.chokerCheck,
            clockCheck: this.state.clockCheck,
            broochCheck: this.state.broochCheck,
            hairclipCheck: this.state.hairclipCheck,
        })
        .then((response) => {
            if(response.data.success == true){
                if(response.data.success == true){
                    this.setState({posts: response.data.posts});
                    console.log(response);
                }else{
                    this.setState({posts: []});
                    console.log(response);
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    findByTitle(){
        console.log(this.state);
        this.findPosts();
    }

    findByEarring(){
        if(this.state.earringCheck == true)
            this.state.earringCheck = false;
        else
            this.state.earringCheck = true;
        console.log(this.state);
        this.findPosts();
    }

    findByPiercing(){
        if(this.state.piercingCheck == true)
            this.state.piercingCheck = false;
        else
            this.state.piercingCheck = true;
        console.log(this.state);
        this.findPosts();
    }

    findByRing(){
        if(this.state.ringCheck == true)
            this.state.ringCheck = false;
        else
            this.state.ringCheck = true;
        console.log(this.state);
        this.findPosts();
    }

    findByWristband(){
        if(this.state.wristbandCheck == true)
            this.state.wristbandCheck = false;
        else
            this.state.wristbandCheck = true;
        console.log(this.state);
        this.findPosts();
    }

    findByNecklace(){
        if(this.state.necklacetCheck == true)
            this.state.necklacetCheck = false;
        else
            this.state.necklacetCheck = true;
        console.log(this.state);
        this.findPosts();
    }

    findByChoker(){
        if(this.state.chokerCheck == true)
            this.state.chokerCheck = false;
        else
            this.state.chokerCheck = true;
        console.log(this.state);
        this.findPosts();
    }

    findByClock(){
        if(this.state.clockCheck == true)
            this.state.clockCheck = false;
        else
            this.state.clockCheck = true;
        console.log(this.state);
        this.findPosts();
    }

    findByBrooch(){
        if(this.state.broochCheck == true)
            this.state.broochCheck = false;
        else
            this.state.broochCheck = true;
        console.log(this.state);
        this.findPosts();
    }

    findByHairclip(){
        if(this.state.hairclipCheck == true)
            this.state.hairclipCheck = false;
        else
            this.state.hairclipCheck = true;
        console.log(this.state);
        this.findPosts();
    }

    createTable = () => {
        let itemList = [];
        for(var i = 0; i <= this.state.posts.length/4; i++){
            if(this.state.posts.length - i*4 != 0){
                var k = 0;
                if((this.state.posts.length - (i * 4)) >= 4)
                    k = 4;
                else
                    k = (this.state.posts.length - (i * 4));
                var item = [];
                for(var j = 0;j < k; j++){
                    var linkHref = '/design/detail/' + this.state.posts[i * 4 + j]._id;
                    var endDate = Date.parse(this.state.posts[i * 4 + j].endDate);
                    var nowDate = new Date();
                    var btMs = endDate - nowDate.getTime();
                    var btDay = parseInt(btMs / (1000*60*60*24)) + 1;
                    var tagList = [];

                    for(var x=0; x < this.state.posts[i * 4 + j].tag.length; x++){
                        var tag=this.state.posts[i * 4 + j].tag[x]
                        var tag_code = 'projectItem_tagt';
                        if(tag=="봄"){
                            tag_code+=" tag_spring";
                        }else if(tag=="여름"){
                            tag_code+=" tag_summer";
                        }else if(tag=="가을"){
                            tag_code+=" tag_fall";
                        }else if(tag=="겨울"){
                            tag_code+=" tag_winter";
                        }else if(tag=="큐트"){
                            tag_code+=" tag_cute";
                        }else if(tag=="화려"){
                            tag_code+=" tag_brilliant";
                        }else if(tag=="우아"){
                            tag_code+=" tag_luxury";
                        }else if(tag=="심플"){
                            tag_code+=" tag_simple";
                        }
                        tagList.push(<div className ={tag_code} >{this.state.posts[i * 4 + j].tag[x]}</div>);
                    }

                    item.push(
                        <div className='projectItem_Column'>
                            <a className='projectItem_ProjectItemCard' href={linkHref}>
                                <img className='projectItem_ProjectItemImage' src={this.state.posts[i * 4 + j].image} alt="My Image"/>
                                <div className='projectItem_ProjectItemTextWrapper'>
                                    <div className='projectItem_FundingTitle'>
                                        <h1 className='projectItem_FundingTitle_t'>{this.state.posts[i * 4 + j].title}</h1>
                                        <p className='projectItem_FundingTitle_w'>{this.state.posts[i * 4 + j].writer.userid}</p>
                                    </div>
                                    <hr className='projectItem_Line'/>
                                    <div className='projectItem_FundingInfo'>
                                        <span className='projectItem_FundingInfo_c'>
                                        <span><img  src="/public/src/calendar.png" width="10" height="10"/>&nbsp;{btDay}일 남음</span>
                                        </span>                                      
                                        <div className='projectItem_FundingInfo_m'>
                                            <span className='projectItem_FundingInfo_money'>♥ &nbsp; {this.state.posts[i * 4 + j].like.length}</span>
                                            <span className='projectItem_FundingInfo_percent'></span>
                                        </div>
                                        <div>                                      
                                            예상가 : &nbsp; {this.state.posts[i * 4 + j].prediction_price}원
                                        </div>
                                    </div>
                                </div>
                                <div className="projectItem_tag">
                                    {tagList}
                                </div>
                            </a>
                        </div>
                    );
                }
                itemList.push(<div className='projectItem_Container'>{item}</div>);
            }
        }
        return itemList
    }

    render(){
        return(
            <div>
                <div className="serch">
                     <div className="roww" >
                        <div className="rowt"><span>결과 내 검색</span></div>
                        <div><span><input type="text" className="searchInput" ref={input => this.search = input} onChange={this.findByTitle}/></span></div>
                    </div>
                    <div className="roww" >
                        <div className="rowt"><span>해시태그</span></div>
                            <div>
                                <span>
                                    <input type="checkbox" className="check" checked={this.state.earringCheck} onChange={this.findByEarring}/>귀걸이
                                    <input type="checkbox" className="check" checked={this.state.piercingCheck} onChange={this.findByPiercing}/>피어싱 
                                    <input type="checkbox" className="check" checked={this.state.ringCheck} onChange={this.findByRing}/>반지
                                    <input type="checkbox" className="check" checked={this.state.wristbandCheck} onChange={this.findByWristband}/>팔찌
                                    <input type="checkbox" className="check" checked={this.state.necklacetCheck} onChange={this.findByNecklace}/>목걸이 
                                    <input type="checkbox" className="check" checked={this.state.chokerCheck} onChange={this.findByChoker}/>초커 
                                    <input type="checkbox" className="check" checked={this.state.clockCheck} onChange={this.findByClock}/>시계 
                                    <input type="checkbox" className="check" checked={this.state.broochCheck} onChange={this.findByBrooch}/>브로치
                                    <input type="checkbox" className="check" checked={this.state.hairclipCheck} onChange={this.findByHairclip}/>머리핀
                                </span>         
                            </div>
                    </div>                
            </div>
            <div>   
                <WriteButton></WriteButton>
                <div>{this.createTable()}</div>
            </div>
        </div>
        );
    }
}
                    
function Design_list() {
    return(
        <div className="App">
            <List></List>   
        </div>
    );
}
ReactDOM.render(<Design_list />, document.getElementById('design_list_container'));

 // React.createElement(component, props, ...children)
//ReactDOM.render(element, container[, callback]) 