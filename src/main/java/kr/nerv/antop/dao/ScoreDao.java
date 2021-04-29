package kr.nerv.antop.dao;

import java.util.List;

import kr.nerv.antop.model.ScoreModel;

public interface ScoreDao {
	// 테이블명
	final public static String TABLE_NAME = "sudoku_score";
	// 각 컬럼명
	public class Columns {
		final public static String SEQ = "seq";
		final public static String GRID_SEQ = "grid_seq";
		final public static String NAME = "name";
		final public static String COST = "cost";
		final public static String CREATED = "created";
		final public static String MODIFIED = "modified";
	}
	
	/**
	 * 고유한 하나의 Score를 찾는다.
	 * @param seq
	 * @return
	 * @throws Exception
	 */
	public ScoreModel findById(int seq) throws Exception;
	
	/**
	 * 스도쿠 그리드에 대한 순위를 오름차순으로 구한다.
	 * @param gridSeq
	 * @return 스코어 리스트
	 * @throws Exception
	 */
	public List<ScoreModel> findByGrid(int gridSeq) throws Exception;
	
	/**
	 * 스코어를 등록한다.
	 * @param score
	 * @return 새로 등록된 seq 번호
	 * @throws Exception
	 */
	public int create(ScoreModel score) throws Exception;

	/**
	 * 스코어를 수정한다.
	 * @param score
	 * @throws Exception
	 */
	public void update(ScoreModel score) throws Exception;
	
	/**
	 * 스코어를 삭제한다.
	 * @param score
	 * @throws Exception
	 */
	public void delete(ScoreModel score) throws Exception;
	
	/**
	 * 현재 자신(ScoreModel)이 몇위인지 조회한다.
	 * @param score
	 * @return
	 * @throws Exception
	 */
	public int getRank(ScoreModel score) throws Exception;
}
