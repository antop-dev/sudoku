package kr.nerv.antop.service;

import java.util.List;

import kr.nerv.antop.model.GridModel;

public interface GridService {
	/**
	 * 디비에 기록되어있는 스도쿠 목록을 가져온다.
	 * 
	 * @param page 페이지번호
	 * @param limit 한페이지당 로우수
	 * @param sort 정렬할 필드
	 * @param dir asc|desc
	 * @return
	 * @throws Exception
	 */
	public List<GridModel> list(int start, int limit, String sort, String dir) throws Exception;

	public int count() throws Exception;
	
	/**
	 * 81자리 스도쿠 그리드 코드를 얻는다.
	 * 
	 * @param seq
	 *            문제 번호(0이면 랜덤)
	 * @return
	 * @throws Exception
	 */
	public GridModel get(int seq) throws Exception;

	/**
	 * 답을 맞춘다.
	 * 
	 * @param seq
	 *            문제 번호
	 * @param answer
	 *            답(81자리 그리드 코드)
	 * @return 참, 거짓
	 * @throws Exception
	 */
	public boolean compare(int seq, String answer) throws Exception;

	/**
	 * 문제를 등록한다.
	 * 
	 * @param grid
	 *            81자리 그리드 코드
	 * @return 문제 번호
	 * @throws Exception
	 */
	public GridModel regist(String grid) throws Exception;

	/**
	 * 문제의 답을 구한다.
	 * 
	 * @param seq
	 *            문제 번호
	 * @return
	 * @throws Exception
	 */
	public List<String> solve(int seq, String grid) throws Exception;

}
