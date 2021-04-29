package kr.nerv.antop.service.impl;

import java.text.SimpleDateFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import kr.nerv.antop.dao.ScoreDao;
import kr.nerv.antop.model.ScoreModel;
import kr.nerv.antop.service.ScoreService;

@Component
public class ScoreServiceImpl implements ScoreService {
	@Autowired
	private ScoreDao scoreDao;
	// simple date format
	private SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");

	@Override
	public List<ScoreModel> list(int gridSeq) throws Exception {
		return scoreDao.findByGrid(gridSeq);
	}

	public ScoreModel regist(int seq, String name, String cost) throws Exception {
		ScoreModel score = new ScoreModel();
		score.setGrid(seq);
		score.setName(name);
		score.setCost(sdf.parse(cost));
		// 데이터베이스에 기록
		int key = scoreDao.create(score);
		score.setSeq(key);
		// 순위 구하기
		int rank = scoreDao.getRank(score);
		score.setRank(rank);

		return score;
	}
}
