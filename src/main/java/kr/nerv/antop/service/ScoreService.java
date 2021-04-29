package kr.nerv.antop.service;

import java.util.List;

import kr.nerv.antop.model.ScoreModel;

public interface ScoreService {
	public List<ScoreModel> list(int gridSeq) throws Exception;
	
	public ScoreModel regist(int seq, String name, String cost) throws Exception;
}
