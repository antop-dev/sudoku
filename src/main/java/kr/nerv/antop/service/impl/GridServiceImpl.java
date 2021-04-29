package kr.nerv.antop.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import kr.nerv.antop.common.ValidateException;
import kr.nerv.antop.dao.GridDao;
import kr.nerv.antop.model.GridModel;
import kr.nerv.antop.service.GridService;
import kr.nerv.antop.sudoku.Grid;
import kr.nerv.antop.sudoku.Solver;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GridServiceImpl implements GridService {
	// log4j
	Logger logger = Logger.getLogger(getClass());
	@Autowired
	private GridDao gridDao;
	@Autowired
	private Solver solver;
	
	public List<GridModel> list(int start, int limit, String sort, String dir) throws Exception {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("start", start);
		params.put("limit", limit);
		params.put("sort", sort);
		params.put("dir", dir);

		return gridDao.find(params);
	}

	public int count() throws Exception {
		return gridDao.getCount();
	}

	public GridModel get(int seq) throws Exception {
		// seq 가 0 이면 랜덤 추출
		if (seq == 0) {
			// 현재 등록되어 있는 문제 갯수
			int total = gridDao.getCount();

			if (total == 0) {
				throw new Exception("문제가 하나도 없습니다.");
			}

			// 랜덤으로 문제 번호 추출
			Random rnd = new Random();
			seq = rnd.nextInt(total) + 1;
		}

		// database 에서 스도쿠 조회
		GridModel sudoku = gridDao.findById(seq);

		if (sudoku == null) {
			throw new Exception(seq + "번 문제가 없습니다.");
		}

		return sudoku;
	}

	public boolean compare(int seq, String answer) throws Exception {
		// 답 유효성 검사
		validateBasic(answer);
		
		try {
			validateDetails(answer);
		} catch (ValidateException e) {
			
		}

		// 문제에 대한 답
		List<String> solutions = getGridBlock(solver.solve(answer));
		// 답이 일치하는게 있는지 검사
		boolean contains = solutions.contains(answer);
		
		return contains;
	}

	public GridModel regist(String grid) throws Exception {
		// 검사
		validateBasic(grid);
		validateDetails(grid);
		
		// 답이 있는 문제인지 검사
		if (solver.solve(grid).size() == 0) {
			throw new Exception("답이 없는 문제입니다.");
		}
		
		// 중복 확인
		GridModel g = gridDao.findByGrid(grid);
		if (g != null) {
			throw new Exception("같은 문제가 존재합니다. (번호:" + g.getSeq() + ")");
		}

		GridModel sudoku = new GridModel();
		sudoku.setGrid(grid);
		// 등록
		int seq = gridDao.create(sudoku);
		sudoku.setSeq(seq);
		
		return sudoku;
	}

	public List<String> solve(int seq, String grid) throws Exception {
		List<Grid> solutions = null;
		
		// 현재까지 푼 것에 대한 답이 있으면 그것에 대한 답을 구해서 준다.
		try {
			if(grid != null) {
				validateBasic(grid);
				validateDetails(grid);
				
				solutions = solver.solve(grid);
							
				if(solutions.size() >= 1) {
					// return
					return getGridBlock(solutions);
				}
			}
		} catch (ValidateException e) {
			// 유효성 검사에서 실패하면 ValidateException을 뱉는다.
			logger.warn(e.getMessage());
		}		

		// 없으면 문제에 대한 답을 구해서 준다.
		GridModel sudoku = gridDao.findById(seq);
		solutions = solver.solve(sudoku.getGrid());
		return getGridBlock(solutions);
	}

	private List<String> getGridBlock(List<Grid> solutions) {
		List<String> s = new ArrayList<String>();
		
		for (Grid g : solutions) {
			s.add(g.getCellString());
		}

		return s;
	}

	/**
	 * 81자리 스도쿠 그리드를 기본적인 것만 검사한다. 이상이 있으면 throw
	 * 
	 * @param grid
	 * @throws Exception
	 */
	private void validateBasic(String grid) throws ValidateException {
		if (grid == null) {
			throw new ValidateException("그리드 코드가 입력되지 않았습니다.");
		}

		// string -> char[]
		char[] chars = grid.trim().toCharArray();
		// 0부터 9까지의 갯수
		int[] count = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };

		int len = 0;
		int n = -1;

		for (int i = 0; i < chars.length; i++) {
			n = chars[i] - 48; // char -> integer
		
			if (n < 0 || n > 9) {
				throw new ValidateException("코드는 0부터 9로만 이루어져야 합니다.");
			}
			// 총 숫자의 갯수
			len++;
			// 숫자별 갯수
			count[n]++;
		}

		// 81개의 숫자(0포함)로 이루어져 있는지 검사
		if (len != 81) {
			throw new ValidateException("숫자가 81개가 아닙니다. (" + len + "개)");
		}
		// 하나의 숫자가 9개 이상 입력 되었는지 검사.
		for (int i = 1; i < count.length; i++) {
			if (count[i] > 9) {
				throw new ValidateException("숫자 " + i + "(이)가 9개 이상입니다.");
			}
		}		
	}
	/**
	 * 상세적인 걸 검사합니다.
	 * 용도에 따라 이 검사가 통과 못하면 답이 틀린 것.
	 * @param grid
	 */
	private void validateDetails(String grid) throws ValidateException {
		if (grid == null) {
			throw new ValidateException("그리드 코드가 입력되지 않았습니다.");
		}
		
		int n;
		// string -> char[]
		char[] chars = grid.trim().toCharArray();
		// set
		Set<Integer> set = new HashSet<Integer>();

		// 열 숫자 검사
		n = -1;
		set.clear();
		for (int x = 0; x < 9; x++) {
			for (int y = 0; y < 9; y++) {
				n = chars[x + (y * 9)] - 48;

				if (n != 0) {
					if (set.contains(n)) {
						throw new ValidateException((x+1) + "번째 열에 두개의 숫자가 존재합니다. (숫자: " + n + ")");
					}
					set.add(n);
				}
			}

			set.clear();
		}
				
		// 행 검사
		n = -1;
		int row = 1;
		set.clear();
		for (int i = 0; i < chars.length; i++) {
			n = ((int) chars[i]) - 48;

			if (n != 0) {	
				if (set.contains(n)) {
					throw new ValidateException(row + "번째 행에 두개의 숫자가 존재합니다. (숫자: " + n + ")");
				}
				set.add(n);
			}
			
			if ((i + 1) % 9 == 0) {				
				row++;
				set.clear();
			}

		}
	}
	
}
